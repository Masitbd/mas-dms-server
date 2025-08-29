import { Schema, model } from "mongoose";
import { IPayment, PaymentModel } from "./payments.interface";

const paymentSchema = new Schema<IPayment, PaymentModel>(
  {
    invoice_no: {
      type: String,

      required: true,
      index: true,
    },

    percentDiscount: { type: Number },
    discountAmount: { type: Number },
    extraDiscount: { type: Number },
    advanceAmount: { type: Number },
    totalVat: { type: Number },
    serviceCharge: { type: Number },
    totalDiscount: { type: Number },
    totalBill: { type: Number, required: true },
    netPayable: { type: Number, required: true },
    purpose: {
      type: String,
      enum: ["sale", "due-collection", "purchase", "adjustment"],
      default: "sale",
      index: true,
    },

    paid: { type: Number, required: true, default: 0 },
    due: { type: Number, required: true, default: 0 },

    method: {
      type: String,
      enum: ["cash", "card", "bkash", "bank"],
      required: true,
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    paidAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    posted_by: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Payment = model<IPayment, PaymentModel>("Payment", paymentSchema);
