/* ============================================================
 * SALES TYPES (Server-side)
 * - Supports posted edits with snapshotVersion history
 * ============================================================
 */

export type ObjectIdLike = string;

export type CustomerMode = "registered" | "unregistered";
export type PatientType = "outdoor" | "indoor";

export type SaleStatus = "draft" | "posted" | "void"; // keep it simple; add "refunded" later if needed

export type PaymentMethod = "cash" | "card" | "bank";

export type Money = number; // if you want stricter money handling later, swap to Decimal128 or decimal.js

/* -----------------------------
 * Audit fields (header-level)
 * ----------------------------- */
export type AuditStamp = {
  createdAt: string; // ISO
  createdBy: ObjectIdLike;

  updatedAt?: string; // ISO
  updatedBy?: ObjectIdLike;

  postedAt?: string; // ISO
  postedBy?: ObjectIdLike;

  voidedAt?: string; // ISO
  voidedBy?: ObjectIdLike;
};

/* -----------------------------
 * Customer snapshot
 * - Always stored (even if registered), for invoice integrity
 * ----------------------------- */
export type CustomerSnapshot = {
  mode: CustomerMode;

  // reference if registered
  customerId: ObjectIdLike | null;

  // snapshot fields (required for printing/history)
  name: string;
  field: string;
  address: string;
  contactNo: string;

  patientType: PatientType;
  bedNo: string | null;
  indoorBillNo: string | null;
};

/* -----------------------------
 * Medicine snapshot
 * - Store minimal invoice-safe fields
 * ----------------------------- */
export type MedicineSnapshot = {
  medicineObjectId: ObjectIdLike; // medicines._id
  medicineId: string; // your human code e.g. "00001"

  name: string;
  genericName?: string | null;
  unit?: string | null;
};

/* -----------------------------
 * Stock/batch snapshot
 * - MUST tie each line to a specific batch (stockId)
 * ----------------------------- */
export type StockSnapshot = {
  stockId: ObjectIdLike; // stocks._id (availableStocks._id)
  purchaseItemId?: ObjectIdLike | null; // recommended for costing/audit
  batchNo: string;
  expiryDate: string; // ISO

  // optional concurrency/audit
  stockUpdatedAt?: string | null; // ISO from stocks.updatedAt
};

/* -----------------------------
 * Line item snapshot
 * - Stores final applied values + derived amounts
 * - Server computes amounts; client provides qty/rate/percent only
 * ----------------------------- */
export type SaleLineItemSnapshot = {
  lineId: string; // server generated id; or keep from client if you want

  medicine: MedicineSnapshot;
  stock: StockSnapshot;

  qty: number;

  // pricing snapshot at time of sale
  rate: Money;

  discountPct: number; // 0..100 (server-enforced caps by role)
  vatPct: number; // 0..100

  // derived amounts (server computed and stored)
  gross: Money; // qty*rate
  discountAmount: Money; // gross*(discountPct/100)
  netBeforeVat: Money; // gross-discountAmount
  vatAmount: Money; // netBeforeVat*(vatPct/100)
  lineTotal: Money; // netBeforeVat+vatAmount
};

/* -----------------------------
 * Finance snapshot
 * - Store both inputs and computed totals
 * ----------------------------- */
export type SaleFinanceSnapshot = {
  // input
  extraDiscount: Money; // cash discount amount
  paymentMethod: PaymentMethod;
  paid: Money;

  // computed totals (server)
  subTotal: Money; // sum(netBeforeVat) BEFORE extraDiscount allocation (policy-defined)
  vatTotal: Money;
  lineDiscountTotal: Money; // sum(discountAmount)

  // rounding policy output
  adjustment: Money; // auto rounding (system-defined policy)

  netPayable: Money;
  due: Money;
};

/* -----------------------------
 * Snapshot Version
 * - Current snapshot lives in `current`
 * - Previous versions kept in `history[]`
 * ----------------------------- */
export type SaleSnapshot = {
  snapshotVersion: number; // 1..n
  snapshotAt: string; // ISO
  snapshotBy: ObjectIdLike; // who created this snapshot (poster/updater)

  customer: CustomerSnapshot;
  items: SaleLineItemSnapshot[];
  finance: SaleFinanceSnapshot;

  // optional but helpful
  note?: string | null;

  // optional compliance info (if needed later)
  policy?: {
    roundingRule?: "ROUND_2DP" | "BANKERS" | null;
    extraDiscountAllocation?: "PROPORTIONAL_NET" | null;
  };
};

/* -----------------------------
 * Sale Document (persisted)
 * ----------------------------- */
export type SaleDocument = {
  _id: ObjectIdLike;

  invoiceNo: string; // unique human-friendly invoice number
  saleDate: string; // ISO (business date)
  status: SaleStatus;

  audit: AuditStamp;

  // ✅ snapshot versioning
  currentVersion: number;
  current: SaleSnapshot;

  history: SaleSnapshot[]; // past versions in ascending order (or store only last N if you want)

  // optional: multi-branch support
  branchId?: ObjectIdLike | null;
  counterId?: ObjectIdLike | null;
};

/* ============================================================
 * DTOs (what API accepts)
 * ============================================================
 */

// Minimal payload the client sends for create/update
export type SaleUpsertDTO = {
  customer: CustomerSnapshot;

  items: Array<{
    medicineObjectId: ObjectIdLike;
    medicineId: string; // optional but recommended from client
    name: string; // optional but recommended from client
    unit?: string | null;

    stockId: ObjectIdLike;
    batchNo: string;
    expiryDate: string;

    qty: number;
    rate: Money;

    discountPct: number;
    vatPct: number;

    stockUpdatedAt?: string | null; // optional optimistic concurrency
  }>;

  finance: {
    extraDiscount: Money;
    paymentMethod: PaymentMethod;
    paid: Money;
  };

  note?: string | null;
};

// Update control for admin edits (posted sale can be edited)
export type SaleUpdateOptions = {
  allowPostedEdit: boolean; // admin-only gate
  updateReason?: string; // store in logs if you keep revision logs
};

// Response shape (typical)
export type SaleUpsertResponse = {
  saleId: ObjectIdLike;
  invoiceNo: string;
  status: SaleStatus;
  currentVersion: number;
};
