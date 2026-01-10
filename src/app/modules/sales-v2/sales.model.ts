import { Schema, model, Types } from "mongoose";

export type SaleStatus = "draft" | "posted" | "void";
export type CustomerMode = "registered" | "unregistered";
export type PatientType = "outdoor" | "indoor";
export type PaymentMethod = "cash" | "card" | "bank";

/** Line item stored as batch-specific (Stock-based) */
export type SaleItem = {
  lineId: string;

  medicineRef: Types.ObjectId; // Medicine _id
  stockRef: Types.ObjectId; // Stock _id (batch)
  purchaseItemId: Types.ObjectId; // from Stock, stored for traceability

  // snapshots (invoice integrity)
  medicineSnapshot: {
    medicineId: string; // e.g. "00001"
    name: string;
    unit?: string | null;
    // genericNameSnapshot?: string | null; // optional (if you want later)
  };

  stockSnapshot: {
    batchNo: string;
    expiryDate: Date;
    stockUpdatedAt?: Date | null; // optional concurrency
  };

  qty: number;
  rate: number;

  discountPct: number; // applied
  vatPct: number; // applied

  // server computed
  gross: number;
  discountAmount: number;
  netBeforeVat: number;
  vatAmount: number;
  lineTotal: number;
};

export type SaleCustomerSnapshot = {
  mode: CustomerMode;

  customerRef?: Types.ObjectId | null; // Customer _id for registered
  customerUuid?: string | null; // your uuid snapshot (optional)

  name: string;
  address: string;
  contactNo: string;

  patientType: PatientType;
  bedNo?: string | null;
  indoorBillNo?: string | null;
};

export type SaleFinanceSnapshot = {
  // client inputs
  paymentMethod: PaymentMethod;
  extraDiscount: number; // amount
  paid: number; // amount

  // server computed totals
  subTotal: number;
  vatTotal: number;
  lineDiscountTotal: number;
  adjustment: number;
  netPayable: number;
  due: number;
};

export type SaleSnapshot = {
  version: number; // 1..n
  snapshotAt: Date;
  snapshotBy: Types.ObjectId; // who created this snapshot (postedBy / admin updater)

  customer: SaleCustomerSnapshot;
  items: SaleItem[];
  finance: SaleFinanceSnapshot;

  note?: string | null;
};

export interface ISale {
  invoiceNo: string;
  saleDate: Date;
  status: SaleStatus;

  // required by you
  postedBy?: Types.ObjectId | null;
  postedAt?: Date | null;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;

  // snapshot versioning
  currentVersion: number;
  current: SaleSnapshot;

  // keep previous versions (admin updates without new sale)
  history: SaleSnapshot[];
}

/* -----------------------------
 * Sub-schemas
 * ----------------------------- */

const SaleItemSchema = new Schema<SaleItem>(
  {
    lineId: { type: String, required: true },

    medicineRef: {
      type: Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    stockRef: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
    purchaseItemId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseItem",
      required: true,
    },

    medicineSnapshot: {
      medicineId: { type: String, required: true },
      name: { type: String, required: true },
      unit: { type: String, default: null },
    },

    stockSnapshot: {
      batchNo: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      stockUpdatedAt: { type: Date, default: null },
    },

    qty: { type: Number, required: true, min: 0.0001 },
    rate: { type: Number, required: true, min: 0 },

    discountPct: { type: Number, required: true, min: 0, max: 100 },
    vatPct: { type: Number, required: true, min: 0, max: 100 },

    gross: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0 },
    netBeforeVat: { type: Number, required: true, min: 0 },
    vatAmount: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CustomerSnapshotSchema = new Schema<SaleCustomerSnapshot>(
  {
    mode: {
      type: String,
      enum: ["registered", "unregistered"],
      required: true,
    },

    customerRef: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    customerUuid: { type: String, default: null },

    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },

    patientType: { type: String, enum: ["outdoor", "indoor"], required: true },
    bedNo: { type: String, default: null, trim: true },
    indoorBillNo: { type: String, default: null, trim: true },
  },
  { _id: false }
);

const FinanceSnapshotSchema = new Schema<SaleFinanceSnapshot>(
  {
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank"],
      required: true,
    },
    extraDiscount: { type: Number, required: true, default: 0, min: 0 },
    paid: { type: Number, required: true, default: 0, min: 0 },

    subTotal: { type: Number, required: true, default: 0, min: 0 },
    vatTotal: { type: Number, required: true, default: 0, min: 0 },
    lineDiscountTotal: { type: Number, required: true, default: 0, min: 0 },
    adjustment: { type: Number, required: true, default: 0 },
    netPayable: { type: Number, required: true, default: 0, min: 0 },
    due: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
);

const SaleSnapshotSchema = new Schema<SaleSnapshot>(
  {
    version: { type: Number, required: true },
    snapshotAt: { type: Date, required: true },
    snapshotBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    customer: { type: CustomerSnapshotSchema, required: true },
    items: { type: [SaleItemSchema], required: true, default: [] },
    finance: { type: FinanceSnapshotSchema, required: true },

    note: { type: String, default: null, trim: true },
  },
  { _id: false }
);

/* -----------------------------
 * Main Sale Schema
 * ----------------------------- */
const SaleSchema = new Schema<ISale>(
  {
    invoiceNo: { type: String, required: true, unique: true }, // ✅ only UNIQUE index here
    saleDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "posted", "void"],
      required: true,
      default: "draft",
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    postedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    postedAt: { type: Date, default: null },

    currentVersion: { type: Number, required: true, default: 1 },
    current: { type: SaleSnapshotSchema, required: true },

    history: { type: [SaleSnapshotSchema], required: true, default: [] },
  },
  { timestamps: true, versionKey: false }
);

/* -----------------------------
 * Minimal indexes (safe, no drama)
 * ----------------------------- */
SaleSchema.index({ saleDate: -1 }); // fast recent sales list
SaleSchema.index({ status: 1, saleDate: -1 }); // filters by status
SaleSchema.index({ "current.customer.customerRef": 1, saleDate: -1 }); // customer ledger

export const Sale = model<ISale>("Sale_v2", SaleSchema);
