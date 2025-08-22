import { Schema, model } from "mongoose";
import { IStock, StockModel } from "./stock.interface";

const stockSchema = new Schema<IStock, StockModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    purchaseItemId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseItem",
      required: true,
    },
    batchNo: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    quantityIn: {
      type: Number,
      required: true,
    },
    quantityOut: {
      type: Number,
      default: 0,
    },
    currentQuantity: {
      type: Number,
      required: true,
    },
    salesRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Stock = model<IStock, StockModel>("Stock", stockSchema);
