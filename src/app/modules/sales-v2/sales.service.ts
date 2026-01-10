import mongoose, { Types } from "mongoose";
import { Stock } from "../stock/stock.model";
import { Medicine } from "../medicines/medicines.model";
import { Customer } from "../customer/customer.model";
import { getNextSequence } from "../customer/counter.model";
import { Sale } from "./sales.model";
// you already have this

/* ============================================================
 * 1) Types (DTO in, Actor, and return shapes)
 * ============================================================
 */

type Role = "admin" | "staff";

export type Actor = {
  userId: Types.ObjectId;
  role: Role;
};

export type PaymentMethod = "cash" | "card" | "bank";
export type CustomerMode = "registered" | "unregistered";
export type PatientType = "outdoor" | "indoor";

export type SaleUpsertDTO = {
  customer: {
    mode: CustomerMode;
    customerId: string | null; // Customer _id for registered else null

    // snapshot fields (invoice integrity)
    name: string;
    field: string;
    address: string;
    contactNo: string;

    patientType: PatientType;
    bedNo?: string | null;
    indoorBillNo?: string | null;
  };

  items: Array<{
    medicineObjectId: string; // Medicine _id
    stockId: string; // Stock _id (batch)
    qty: number;
    rate: number;
    discountPct: number; // percent
    vatPct: number; // percent

    // optional concurrency (if you want)
    stockUpdatedAt?: string | null;
  }>;

  finance: {
    extraDiscount: number; // amount
    paymentMethod: PaymentMethod;
    paid: number; // amount
  };

  note?: string | null;
};

export type PostSaleResult = {
  saleId: string;
  invoiceNo: string;
  version: number;
};

/* ============================================================
 * 2) Small utils (strict + predictable)
 * ============================================================
 */

class ServiceError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

function safeNum(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function oid(id: string, label: string) {
  if (!Types.ObjectId.isValid(id))
    throw new ServiceError(400, `Invalid ${label}.`);
  return new Types.ObjectId(id);
}

function makeLineId() {
  return new Types.ObjectId().toString();
}

function formatInvoiceNo(seq: number) {
  // You can change format anytime; keep it stable once live.
  return `S-${String(seq).padStart(8, "0")}`;
}

function discountCapPct(actor: Actor, medicineDefaultDiscountPct: number) {
  return actor.role === "admin"
    ? 100
    : clamp(safeNum(medicineDefaultDiscountPct, 0), 0, 100);
}

/* ============================================================
 * 3) Validation (hard fail; no silent corruption)
 * ============================================================
 */

function validateDto(dto: SaleUpsertDTO) {
  if (!dto) throw new ServiceError(400, "Missing payload.");

  if (!dto.customer) throw new ServiceError(400, "Missing customer block.");
  if (!dto.items || dto.items.length === 0)
    throw new ServiceError(400, "No items provided.");
  if (!dto.finance) throw new ServiceError(400, "Missing finance block.");

  const c = dto.customer;
  console.log(dto);

  if (!["registered", "unregistered"].includes(c.mode))
    throw new ServiceError(400, "Invalid customer.mode.");

  if (c.mode === "registered") {
    if (!c.customerId || !Types.ObjectId.isValid(c.customerId))
      throw new ServiceError(400, "Registered customerId is required.");
  }

  if (!String(c.name ?? "").trim())
    throw new ServiceError(400, "Customer name is required.");
  if (!String(c.contactNo ?? "").trim())
    throw new ServiceError(400, "Customer contactNo is required.");

  if (!["outdoor", "indoor"].includes(c.patientType))
    throw new ServiceError(400, "Invalid patientType.");
  if (c.patientType === "indoor") {
    if (!String(c.bedNo ?? "").trim())
      throw new ServiceError(400, "Bed No is required for indoor.");
    if (!String(c.indoorBillNo ?? "").trim())
      throw new ServiceError(400, "Indoor Bill No is required for indoor.");
  }

  if (!["cash", "card", "bank"].includes(dto.finance.paymentMethod))
    throw new ServiceError(400, "Invalid paymentMethod.");

  for (const it of dto.items) {
    if (!Types.ObjectId.isValid(it.medicineObjectId))
      throw new ServiceError(400, "Invalid medicineObjectId.");
    if (!Types.ObjectId.isValid(it.stockId))
      throw new ServiceError(400, "Invalid stockId.");

    const qty = safeNum(it.qty, NaN);
    const rate = safeNum(it.rate, NaN);
    if (!Number.isFinite(qty) || qty <= 0)
      throw new ServiceError(400, "Invalid item qty.");
    if (!Number.isFinite(rate) || rate < 0)
      throw new ServiceError(400, "Invalid item rate.");

    const disc = safeNum(it.discountPct, NaN);
    const vat = safeNum(it.vatPct, NaN);
    if (!Number.isFinite(disc) || disc < 0 || disc > 100)
      throw new ServiceError(400, "Invalid item discountPct.");
    if (!Number.isFinite(vat) || vat < 0 || vat > 100)
      throw new ServiceError(400, "Invalid item vatPct.");
  }
}

/* ============================================================
 * 4) Core compute (server is source of truth)
 *    - VAT computed on net after proportional extraDiscount allocation
 * ============================================================
 */

type BuiltLine = {
  lineId: string;

  medicineRef: Types.ObjectId;
  stockRef: Types.ObjectId;
  purchaseItemId: Types.ObjectId;

  medicineSnapshot: { medicineId: string; name: string; unit?: string | null };
  stockSnapshot: {
    batchNo: string;
    expiryDate: Date;
    stockUpdatedAt?: Date | null;
  };

  qty: number;
  rate: number;
  discountPct: number;
  vatPct: number;

  gross: number;
  discountAmount: number;
  netBeforeVat: number;

  vatAmount: number; // computed after extra discount allocation
  lineTotal: number; // netBeforeVat + vatAmount (extra discount shown separately)
};

function computeTotals(
  lines: BuiltLine[],
  extraDiscount: number,
  paidInput: number
) {
  const subTotal = round2(
    lines.reduce((s, x) => s + safeNum(x.netBeforeVat, 0), 0)
  );
  const lineDiscountTotal = round2(
    lines.reduce((s, x) => s + safeNum(x.discountAmount, 0), 0)
  );

  const extra = round2(clamp(safeNum(extraDiscount, 0), 0, subTotal));

  // VAT on (netBeforeVat - proportionalExtraShare)
  const vatTotalRaw = (() => {
    if (subTotal <= 0) return 0;
    let v = 0;
    for (const x of lines) {
      const share = safeNum(x.netBeforeVat, 0) / subTotal;
      const base = Math.max(safeNum(x.netBeforeVat, 0) - extra * share, 0);
      v += (base * clamp(safeNum(x.vatPct, 0), 0, 100)) / 100;
    }
    return v;
  })();

  const vatTotal = round2(vatTotalRaw);

  const netPayableRaw = Math.max(subTotal - extra, 0) + vatTotal;

  const rounded = round2(netPayableRaw);
  const adjustment = round2(rounded - netPayableRaw);
  const netPayable = round2(netPayableRaw + adjustment);

  const paid = round2(clamp(safeNum(paidInput, 0), 0, netPayable));
  const due = round2(Math.max(netPayable - paid, 0));

  return {
    subTotal,
    vatTotal,
    lineDiscountTotal,
    extraDiscount: extra,
    adjustment,
    netPayable,
    paid,
    due,
  };
}

/* ============================================================
 * 5) Build snapshot lines (loads Stock + Medicine, caps discount)
 * ============================================================
 */

async function buildLinesFromDto(
  dto: SaleUpsertDTO,
  actor: Actor,
  session: mongoose.ClientSession
) {
  const stockIds = [...new Set(dto.items.map((x) => x.stockId))].map((id) =>
    oid(id, "stockId")
  );
  const medicineIds = [
    ...new Set(dto.items.map((x) => x.medicineObjectId)),
  ].map((id) => oid(id, "medicineObjectId"));

  // Load stocks + medicines (single queries)
  const stocks = await Stock.find({ _id: { $in: stockIds } }).session(session);
  const meds = await Medicine.find({ _id: { $in: medicineIds } }).session(
    session
  );

  const stockMap = new Map<string, any>(
    stocks.map((s: any) => [String(s._id), s])
  );
  const medMap = new Map<string, any>(meds.map((m: any) => [String(m._id), m]));

  // Validate: every referenced doc exists + stock belongs to medicine
  for (const it of dto.items) {
    const st = stockMap.get(String(it.stockId));
    if (!st) throw new ServiceError(404, "Stock batch not found.");
    const med = medMap.get(String(it.medicineObjectId));
    if (!med) throw new ServiceError(404, "Medicine not found.");

    if (String(st.productId) !== String(med._id)) {
      throw new ServiceError(
        400,
        "Stock does not belong to the provided medicine."
      );
    }
  }

  // Stock availability check (sum qty by stockId)
  const needByStock = new Map<string, number>();
  for (const it of dto.items) {
    needByStock.set(
      String(it.stockId),
      (needByStock.get(String(it.stockId)) ?? 0) + safeNum(it.qty, 0)
    );
  }
  for (const [stockId, needQty] of needByStock.entries()) {
    const st = stockMap.get(stockId);
    if (!st) throw new ServiceError(404, "Stock batch not found.");
    if (safeNum(st.currentQuantity, 0) < needQty) {
      throw new ServiceError(
        400,
        `Insufficient stock for batch ${st.batchNo}.`
      );
    }
  }

  // Build line snapshots (one per DTO row; ok if duplicates)
  const built: BuiltLine[] = dto.items.map((it) => {
    const st = stockMap.get(String(it.stockId));
    const med = medMap.get(String(it.medicineObjectId));

    const medDefaultDiscount = safeNum(med.discount ?? 0, 0);
    const cap = discountCapPct(actor, medDefaultDiscount);

    const qty = round2(safeNum(it.qty, 0));
    const rate = round2(safeNum(it.rate, 0));

    const discountPct = round2(clamp(safeNum(it.discountPct, 0), 0, cap));
    const vatPct = round2(clamp(safeNum(it.vatPct, 0), 0, 100));

    const gross = round2(qty * rate);
    const discountAmount = round2((gross * discountPct) / 100);
    const netBeforeVat = round2(Math.max(gross - discountAmount, 0));

    return {
      lineId: makeLineId(),

      medicineRef: med._id,
      stockRef: st._id,
      purchaseItemId: st.purchaseItemId,

      medicineSnapshot: {
        medicineId: String(med.medicineId ?? ""),
        name: String(med.name ?? ""),
        unit: med.unit ?? null,
      },

      stockSnapshot: {
        batchNo: String(st.batchNo ?? ""),
        expiryDate: new Date(st.expiryDate),
        stockUpdatedAt: it.stockUpdatedAt
          ? new Date(it.stockUpdatedAt)
          : st.updatedAt
          ? new Date(st.updatedAt)
          : null,
      },

      qty,
      rate,
      discountPct,
      vatPct,

      gross,
      discountAmount,
      netBeforeVat,

      vatAmount: 0,
      lineTotal: 0,
    };
  });

  return { builtLines: built, needByStock, stockMap };
}

/* ============================================================
 * 6) Apply VAT allocation back onto each line (stored snapshot)
 * ============================================================
 */

function applyVatAndLineTotals(lines: BuiltLine[], extraDiscount: number) {
  const subTotal = lines.reduce((s, x) => s + safeNum(x.netBeforeVat, 0), 0);
  const extra = clamp(safeNum(extraDiscount, 0), 0, subTotal);

  for (const x of lines) {
    const share = subTotal > 0 ? safeNum(x.netBeforeVat, 0) / subTotal : 0;
    const base = Math.max(safeNum(x.netBeforeVat, 0) - extra * share, 0);
    const vatAmount = round2(
      (base * clamp(safeNum(x.vatPct, 0), 0, 100)) / 100
    );

    x.vatAmount = vatAmount;
    x.lineTotal = round2(safeNum(x.netBeforeVat, 0) + vatAmount);
  }
}

/* ============================================================
 * 7) Service: POST (create + post)
 * ============================================================
 */
async function postSale(
  dto: SaleUpsertDTO,
  actor: Actor
): Promise<PostSaleResult> {
  console.log("hi");
  validateDto(dto);

  const session = await mongoose.startSession();
  try {
    let result: PostSaleResult | null = null;

    await session.withTransaction(async () => {
      const now = new Date();

      // Build lines + verify stock + cap discounts
      const { builtLines, needByStock } = await buildLinesFromDto(
        dto,
        actor,
        session
      );

      // Customer snapshot: if registered, verify customer exists and snap uuid/name/phone if you want
      let customerRef: Types.ObjectId | null = null;
      let customerUuid: string | null = null;

      if (dto.customer.mode === "registered" && dto.customer.customerId) {
        customerRef = oid(dto.customer.customerId, "customerId");
        const cust = await Customer.findById(customerRef).session(session);
        if (!cust) throw new ServiceError(404, "Customer not found.");

        // snapshot uuid if exists
        customerUuid = String((cust as any).uuid ?? null);

        // you may optionally override snapshot fields from DB for registered customers:
        // dto.customer.name = cust.fullName; dto.customer.contactNo = cust.phone;
      }

      // Compute totals
      const totals = computeTotals(
        builtLines,
        dto.finance.extraDiscount,
        dto.finance.paid
      );

      // Apply VAT allocation into each line snapshot
      applyVatAndLineTotals(builtLines, totals.extraDiscount);

      // Generate invoiceNo
      const seq = await getNextSequence("sale_invoice"); // if your helper supports session, pass it: getNextSequence("sale_invoice", session)
      const invoiceNo = formatInvoiceNo(seq);

      // Create snapshot
      const snapshot = {
        version: 1,
        snapshotAt: now,
        snapshotBy: actor.userId,

        customer: {
          mode: dto.customer.mode,
          customerRef,
          customerUuid,

          name: String(dto.customer.name ?? "").trim(),
          field: String(dto.customer.field ?? "").trim(),
          address: String(dto.customer.address ?? "").trim(),
          contactNo: String(dto.customer.contactNo ?? "").trim(),

          patientType: dto.customer.patientType,
          bedNo:
            dto.customer.patientType === "indoor"
              ? String(dto.customer.bedNo ?? "").trim()
              : null,
          indoorBillNo:
            dto.customer.patientType === "indoor"
              ? String(dto.customer.indoorBillNo ?? "").trim()
              : null,
        },

        items: builtLines.map((x) => ({
          lineId: x.lineId,
          medicineRef: x.medicineRef,
          stockRef: x.stockRef,
          purchaseItemId: x.purchaseItemId,

          medicineSnapshot: x.medicineSnapshot,
          stockSnapshot: x.stockSnapshot,

          qty: x.qty,
          rate: x.rate,
          discountPct: x.discountPct,
          vatPct: x.vatPct,

          gross: x.gross,
          discountAmount: x.discountAmount,
          netBeforeVat: x.netBeforeVat,
          vatAmount: x.vatAmount,
          lineTotal: x.lineTotal,
        })),

        finance: {
          paymentMethod: dto.finance.paymentMethod,
          extraDiscount: totals.extraDiscount,
          paid: totals.paid,

          subTotal: totals.subTotal,
          vatTotal: totals.vatTotal,
          lineDiscountTotal: totals.lineDiscountTotal,
          adjustment: totals.adjustment,
          netPayable: totals.netPayable,
          due: totals.due,
        },

        note: dto.note ?? null,
      };
      console.log(snapshot);
      // Decrement stock (atomic per batch)
      for (const [stockIdStr, needQty] of needByStock.entries()) {
        const stockId = new Types.ObjectId(stockIdStr);

        const r = await Stock.updateOne(
          { _id: stockId, currentQuantity: { $gte: needQty } },
          { $inc: { currentQuantity: -needQty, quantityOut: needQty } },
          { session }
        );

        if (r.modifiedCount !== 1) {
          throw new ServiceError(400, "Stock changed. Please retry.");
        }
      }

      // Create sale (posted)
      const saleDoc = await Sale.create(
        [
          {
            invoiceNo,
            saleDate: now,
            status: "posted",

            createdBy: actor.userId,
            postedBy: actor.userId,
            postedAt: now,

            updatedBy: null,

            currentVersion: 1,
            current: snapshot,
            history: [],
          },
        ],
        { session }
      );

      result = { saleId: String(saleDoc[0]._id), invoiceNo, version: 1 };
    });

    if (!result) throw new ServiceError(500, "Failed to post sale.");
    return result;
  } finally {
    await session.endSession();
  }
}

/* ============================================================
 * 8) Service: UPDATE posted sale (admin in-place, versioned)
 * ============================================================
 */

export async function updatePostedSale(
  saleId: string,
  dto: SaleUpsertDTO,
  actor: Actor
): Promise<PostSaleResult> {
  console.log(saleId);
  validateDto(dto);

  if (actor.role !== "admin") {
    throw new ServiceError(403, "Only admin can update a posted sale.");
  }

  const session = await mongoose.startSession();
  try {
    let result: PostSaleResult | null = null;

    await session.withTransaction(async () => {
      const sale = await Sale.findById(oid(saleId, "saleId")).session(session);
      if (!sale) throw new ServiceError(404, "Sale not found.");
      if ((sale as any).status === "void")
        throw new ServiceError(400, "Void sale cannot be edited.");

      // Only posted sale in-place edit (your requirement)
      if ((sale as any).status !== "posted")
        throw new ServiceError(400, "Only posted sales can be edited here.");

      const now = new Date();
      const prevSnapshot = (sale as any).current;
      const prevVersion = Number((sale as any).currentVersion ?? 1);
      const nextVersion = prevVersion + 1;

      // old qty per stockRef
      const oldByStock = new Map<string, number>();
      for (const it of prevSnapshot.items ?? []) {
        const sid = String(it.stockRef);
        oldByStock.set(sid, (oldByStock.get(sid) ?? 0) + safeNum(it.qty, 0));
      }

      // Build new lines (also verifies stock existence + medicine match)
      const { builtLines, needByStock, stockMap } = await buildLinesFromDto(
        dto,
        actor,
        session
      );

      // Compute delta per stockId: new - old
      const allStockIds = new Set<string>([
        ...oldByStock.keys(),
        ...needByStock.keys(),
      ]);
      const deltaByStock = new Map<string, number>();

      for (const sid of allStockIds) {
        const oldQty = oldByStock.get(sid) ?? 0;
        const newQty = needByStock.get(sid) ?? 0;
        deltaByStock.set(sid, round2(newQty - oldQty));
      }

      // Apply stock deltas safely
      for (const [sid, delta] of deltaByStock.entries()) {
        if (!delta) continue;

        const st =
          stockMap.get(sid) ??
          (await Stock.findById(new Types.ObjectId(sid)).session(session));
        if (!st) throw new ServiceError(404, "Stock not found during update.");

        if (delta > 0) {
          // need more stock out
          const r = await Stock.updateOne(
            { _id: st._id, currentQuantity: { $gte: delta } },
            { $inc: { currentQuantity: -delta, quantityOut: delta } },
            { session }
          );
          if (r.modifiedCount !== 1)
            throw new ServiceError(
              400,
              `Insufficient stock for batch ${st.batchNo}.`
            );
        } else {
          // delta < 0 => return stock back
          const addBack = Math.abs(delta);

          // prevent quantityOut going negative
          if (safeNum(st.quantityOut, 0) < addBack) {
            throw new ServiceError(
              400,
              `Stock ledger mismatch for batch ${st.batchNo}.`
            );
          }

          const r = await Stock.updateOne(
            { _id: st._id, quantityOut: { $gte: addBack } },
            { $inc: { currentQuantity: addBack, quantityOut: -addBack } },
            { session }
          );
          if (r.modifiedCount !== 1)
            throw new ServiceError(400, "Stock update failed. Please retry.");
        }
      }

      // Customer snapshot (verify registered customer if set)
      let customerRef: Types.ObjectId | null = null;
      let customerUuid: string | null = null;

      if (dto.customer.mode === "registered" && dto.customer.customerId) {
        customerRef = oid(dto.customer.customerId, "customerId");
        const cust = await Customer.findById(customerRef).session(session);
        if (!cust) throw new ServiceError(404, "Customer not found.");
        customerUuid = String((cust as any).uuid ?? null);
      }

      // Totals
      const totals = computeTotals(
        builtLines,
        dto.finance.extraDiscount,
        dto.finance.paid
      );
      applyVatAndLineTotals(builtLines, totals.extraDiscount);

      // New snapshot
      const nextSnapshot = {
        version: nextVersion,
        snapshotAt: now,
        snapshotBy: actor.userId,

        customer: {
          mode: dto.customer.mode,
          customerRef,
          customerUuid,

          name: String(dto.customer.name ?? "").trim(),
          field: String(dto.customer.field ?? "").trim(),
          address: String(dto.customer.address ?? "").trim(),
          contactNo: String(dto.customer.contactNo ?? "").trim(),

          patientType: dto.customer.patientType,
          bedNo:
            dto.customer.patientType === "indoor"
              ? String(dto.customer.bedNo ?? "").trim()
              : null,
          indoorBillNo:
            dto.customer.patientType === "indoor"
              ? String(dto.customer.indoorBillNo ?? "").trim()
              : null,
        },

        items: builtLines.map((x) => ({
          lineId: x.lineId,
          medicineRef: x.medicineRef,
          stockRef: x.stockRef,
          purchaseItemId: x.purchaseItemId,

          medicineSnapshot: x.medicineSnapshot,
          stockSnapshot: x.stockSnapshot,

          qty: x.qty,
          rate: x.rate,
          discountPct: x.discountPct,
          vatPct: x.vatPct,

          gross: x.gross,
          discountAmount: x.discountAmount,
          netBeforeVat: x.netBeforeVat,
          vatAmount: x.vatAmount,
          lineTotal: x.lineTotal,
        })),

        finance: {
          paymentMethod: dto.finance.paymentMethod,
          extraDiscount: totals.extraDiscount,
          paid: totals.paid,

          subTotal: totals.subTotal,
          vatTotal: totals.vatTotal,
          lineDiscountTotal: totals.lineDiscountTotal,
          adjustment: totals.adjustment,
          netPayable: totals.netPayable,
          due: totals.due,
        },

        note: dto.note ?? null,
      };

      // Update sale: push prev current into history, set current to new snapshot
      // Keep postedBy/postedAt as original poster; only updatedBy changes.
      (sale as any).history.push(prevSnapshot);
      (sale as any).current = nextSnapshot;
      (sale as any).currentVersion = nextVersion;
      (sale as any).updatedBy = actor.userId;

      await sale.save({ session });

      result = {
        saleId: String(sale._id),
        invoiceNo: String((sale as any).invoiceNo),
        version: nextVersion,
      };
    });

    if (!result) throw new ServiceError(500, "Failed to update sale.");
    return result;
  } finally {
    await session.endSession();
  }
}

/* ============================================================
 * 9) Fetch: invoice view (supports version)
 * ============================================================
 */

export async function getSaleForInvoice(saleId: string, version?: number) {
  const sale = await Sale.findById(oid(saleId, "saleId")).lean();
  if (!sale) throw new ServiceError(404, "Sale not found.");

  const currentVersion = Number((sale as any).currentVersion ?? 1);
  const cur = (sale as any).current;
  const history = (sale as any).history ?? [];

  let snap = cur;
  if (version != null) {
    const v = Number(version);
    if (v === currentVersion) snap = cur;
    else {
      const found = history.find((x: any) => Number(x.version) === v);
      if (!found) throw new ServiceError(404, "Requested version not found.");
      snap = found;
    }
  }

  return {
    saleId: String((sale as any)._id),
    invoiceNo: String((sale as any).invoiceNo),
    saleDate: (sale as any).saleDate,
    status: (sale as any).status,

    postedBy: (sale as any).postedBy,
    postedAt: (sale as any).postedAt,

    version: Number(snap.version),
    snapshotAt: snap.snapshotAt,
    snapshotBy: snap.snapshotBy,

    customer: snap.customer,
    items: snap.items,
    finance: snap.finance,
    note: snap.note ?? null,
  };
}

/* ============================================================
 * 10) Fetch: UI visualization/edit view (compact + predictable)
 *     - Designed to hydrate your SalesPage state
 * ============================================================
 */

export async function getSaleForUi(saleId: string) {
  const sale = await Sale.findById(oid(saleId, "saleId")).lean();
  if (!sale) throw new ServiceError(404, "Sale not found.");

  const snap = (sale as any).current;

  return {
    saleId: String((sale as any)._id),
    invoiceNo: String((sale as any).invoiceNo),
    status: (sale as any).status,
    currentVersion: Number((sale as any).currentVersion ?? 1),

    // customer block to set customer state on frontend
    customer: {
      mode: snap.customer.mode,
      customerId: snap.customer.customerRef
        ? String(snap.customer.customerRef)
        : null,

      name: snap.customer.name,
      field: snap.customer.field,
      address: snap.customer.address,
      contactNo: snap.customer.contactNo,

      patientType: snap.customer.patientType,
      bedNo: snap.customer.bedNo ?? null,
      indoorBillNo: snap.customer.indoorBillNo ?? null,
    },

    // items block to set cart lines on frontend (batch specific)
    items: (snap.items ?? []).map((it: any) => ({
      medicineObjectId: String(it.medicineRef),
      stockId: String(it.stockRef),
      batchNo: it.stockSnapshot.batchNo,
      expiryDate: it.stockSnapshot.expiryDate,

      qty: it.qty,
      rate: it.rate,
      discountPct: it.discountPct,
      vatPct: it.vatPct,
    })),

    // finance inputs for UI
    finance: {
      paymentMethod: snap.finance.paymentMethod,
      extraDiscount: snap.finance.extraDiscount,
      paid: snap.finance.paid,
    },

    // computed summary for display
    summary: {
      subTotal: snap.finance.subTotal,
      vatTotal: snap.finance.vatTotal,
      lineDiscountTotal: snap.finance.lineDiscountTotal,
      adjustment: snap.finance.adjustment,
      netPayable: snap.finance.netPayable,
      due: snap.finance.due,
    },

    note: snap.note ?? null,
  };
}

const getSalesForUpdate = async (id: string) => {
  const sales = await Sale.findById(oid(id, "saleId")).lean();
  const sale = await Sale.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    ...(sales?.current?.customer?.customerRef
      ? [
          {
            $lookup: {
              from: "customers",
              localField: "current.customer.customerRef",
              foreignField: "_id",
              as: "current.customer.customerRef",
            },
          },
          {
            $unwind: {
              path: "$current.customer.customerRef",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "medicines",
        let: { ids: "$current.items.medicineRef" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
          { $project: { name: 1, unit: 1, medicineId: 1, discount: 1 } },
        ],
        as: "_medicines",
      },
    },

    // Stocks (bulk lookup)
    {
      $lookup: {
        from: "stocks",
        let: { ids: "$current.items.stockRef" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
          {
            $project: {
              batchNo: 1,
              expiryDate: 1,
              stockUpdatedAt: 1,
              salesRate: 1,
              currentQuantity: 1,
            },
          },
        ],
        as: "_stocks",
      },
    },

    // Attach medicine + stock to each line item
    {
      $set: {
        "current.items": {
          $map: {
            input: "$current.items",
            as: "it",
            in: {
              $mergeObjects: [
                "$$it",
                {
                  medicineData: {
                    $first: {
                      $filter: {
                        input: "$_medicines",
                        as: "m",
                        cond: { $eq: ["$$m._id", "$$it.medicineRef"] },
                      },
                    },
                  },
                  stockData: {
                    $first: {
                      $filter: {
                        input: "$_stocks",
                        as: "s",
                        cond: { $eq: ["$$s._id", "$$it.stockRef"] },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },

    // Cleanup
    { $unset: ["_medicines", "_stocks"] },
  ]);
  if (!sale) throw new ServiceError(404, "Sale not found.");
  return sale;
};

const getAllSales = async (query: Record<any, any>) => {
  const salesSearchableFields = [
    "invoiceNo",
    "current.customer.name",
    "current.customer.contactNo",
  ];
  const matchConditions: Record<any, any> = {};
  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    matchConditions.$or = salesSearchableFields.map((field) => ({
      [field]: searchRegex,
    }));
  }

  // Handle additional filters
  // if (query.category) matchConditions.category = query.category;
  // if (query.manufacturer) matchConditions.manufacturer = query.manufacturer;
  // if (query.status) matchConditions.status = query.status;

  // Pagination setup
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 100;
  const skip = (page - 1) * limit;
  const total = await Sale.countDocuments(matchConditions);

  const data = await Sale.find(matchConditions)
    .sort({ saleDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const SalesServiceV_2 = {
  postSale,
  updatePostedSale,
  getSaleForInvoice,
  getSaleForUi,
  getSalesForUpdate,
  getAllSales,
};
