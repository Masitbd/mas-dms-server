// models/customer.model.ts
import mongoose, {
  Schema,
  model,
  models,
  type InferSchemaType,
} from "mongoose";
import { getNextSequence } from "./counter.model";

type CustomerType = "Regular" | "Patient" | "Corporate";
type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

const normalizeSpaces = (s: unknown) =>
  String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");

const normalizeEmail = (s: unknown) => {
  const v = String(s ?? "")
    .trim()
    .toLowerCase();
  return v || undefined;
};

const normalizePhone = (s: unknown) => {
  const v = String(s ?? "").trim();
  const digits = v.replace(/[^\d]/g, "");
  if (!digits) return "";
  return "+" + digits; // always store with leading "+"
};
function formatCustomerUuid(seq: number) {
  // readable + sortable + compact
  return `${String(seq).padStart(6, "0")}`;
}

const isValidPhone = (v: string) => /^\+\d{8,15}$/.test(v);
const CustomerSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },

    customerType: {
      type: String,
      enum: ["Regular", "Patient", "Corporate"] as CustomerType[],
      required: true,
      default: "Patient",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: { validator: isValidPhone, message: "Invalid phone format." },
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
      default: undefined,
      validate: {
        validator: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format.",
      },
    },

    dateOfBirth: { type: Date, default: null, index: true },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"] as Gender[],
      default: "Prefer not to say",
    },

    nidOrPassport: {
      type: String,
      trim: true,
      maxlength: 40,
      default: undefined,
    },

    address: {
      line1: { type: String, trim: true, maxlength: 120, default: undefined },
      line2: { type: String, trim: true, maxlength: 120, default: undefined },
      city: { type: String, trim: true, maxlength: 60, default: undefined },
      state: { type: String, trim: true, maxlength: 60, default: undefined },
      postalCode: {
        type: String,
        trim: true,
        maxlength: 12,
        default: undefined,
      },
    },

    loyaltyId: {
      type: String,
      trim: true,
      maxlength: 32,
      default: undefined,
    },

    allowCredit: { type: Boolean, required: true, default: false, index: true },
    creditLimit: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 10_000_000,
    },

    discountPercent: { type: Number, min: 0, max: 100, default: 0 },

    medical: {
      allergies: {
        type: String,
        trim: true,
        maxlength: 200,
        default: undefined,
      },
      chronicConditions: {
        type: String,
        trim: true,
        maxlength: 200,
        default: undefined,
      },
    },

    notes: { type: String, trim: true, maxlength: 800, default: undefined },

    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Optional unique email only when provided
CustomerSchema.index({ fullName: "text", phone: "text", uuid: "text" });

// Normalize + business rules
CustomerSchema.pre("validate", async function (next) {
  // generation of uuid of the customers
  if (this.isNew && !this.uuid) {
    const seq = await getNextSequence("customer");
    this.uuid = formatCustomerUuid(seq);
  }
  this.fullName = normalizeSpaces(this.fullName);

  this.phone = normalizePhone(this.phone);

  this.email = normalizeEmail(this.email);

  this.nidOrPassport = normalizeSpaces(this.nidOrPassport) || undefined;

  if (this.address) {
    this.address.line1 = normalizeSpaces(this.address.line1) || undefined;

    this.address.line2 = normalizeSpaces(this.address.line2) || undefined;

    this.address.city = normalizeSpaces(this.address.city) || undefined;

    this.address.state = normalizeSpaces(this.address.state) || undefined;

    this.address.postalCode =
      String(this.address.postalCode ?? "").trim() || undefined;
  }

  if (!this.allowCredit) this.creditLimit = 0;

  if (this.creditLimit == null || Number.isNaN(this.creditLimit))
    this.creditLimit = 0;

  // @ts-expect-error mongoose typing
  if (this.discountPercent === undefined) this.discountPercent = null;

  next();
});

export type CustomerDocument = InferSchemaType<typeof CustomerSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Customer =
  models.Customer || model<CustomerDocument>("Customer", CustomerSchema);
