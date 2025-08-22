import { Schema, model } from "mongoose";
import { IPayment, PaymentModel } from "./payments.interface";

const paymentSchema = new Schema<IPayment, PaymentModel>(
  {
    invoice_no: {
      type: String,

      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
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
