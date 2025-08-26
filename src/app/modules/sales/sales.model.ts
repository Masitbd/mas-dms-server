import { Schema, model } from "mongoose";
import { IMedicineSale, ISale } from "./sales.interface";
const medicienSaleSchema = new Schema<IMedicineSale>({
  medicineId: {
    type: Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  quantity: { type: Number, require: true, min: 1 },
  unit_price: { type: Number },
  total_price: { type: Number },
  discount: { type: Number },
  discount_type: { type: String },
});

const salesSchema = new Schema<ISale>(
  {
    name: {
      type: String,
      index: true,
    },
    address: {
      type: String,
    },
    contact_no: {
      type: String,
      index: true,
    },
    medicines: [medicienSaleSchema],
    transaction_date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Payment",
    },
    invoice_no: {
      type: String,
      required: true,
      unique: true,
    },
    patient_type: {
      type: String,
      required: true,
      enum: ["outdoor", "indoor", "general"],
      default: "outdoor",
    },
    bed_no: {
      type: String,
    },

    indoor_bill_no: {
      type: String,
    },
    posted_by: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const Sale = model("Sale", salesSchema);
