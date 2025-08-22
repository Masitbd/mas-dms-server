import { Schema, model } from "mongoose";
import { IPurchase, PurchaseModel } from "./purchases.interface";

const purchaseSchema = new Schema<IPurchase, PurchaseModel>(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    vatPercentage: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["due", "partial", "paid"],
      default: "due",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Purchase = model<IPurchase, PurchaseModel>(
  "Purchase",
  purchaseSchema
);
