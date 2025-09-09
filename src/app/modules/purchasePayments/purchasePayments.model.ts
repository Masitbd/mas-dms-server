import { Schema, model } from "mongoose";
import {
  IPurchasePayment,
  PurchasePaymentModel,
} from "./purchasePayments.interface";

const purchasePaymentSchema = new Schema<
  IPurchasePayment,
  PurchasePaymentModel
>(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
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
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const PurchasePayment = model<IPurchasePayment, PurchasePaymentModel>(
  "PurchasePayment",
  purchasePaymentSchema
);
