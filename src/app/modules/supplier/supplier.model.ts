import { model, Schema } from "mongoose";
import { TSupplier } from "./supplier.interface";

const supplierSchema = new Schema<TSupplier>(
  {
    name: { type: String, required: true },
    contact_person: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    fax: { type: String },
    email: { type: String },
    country: { type: String },
    city: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Supplier = model("Supplier", supplierSchema);
