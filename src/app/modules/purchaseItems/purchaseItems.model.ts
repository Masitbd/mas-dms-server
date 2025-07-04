import { Schema, model } from 'mongoose';
import { IPurchaseItem, PurchaseItemModel } from './purchaseItems.interface';

const purchaseItemSchema = new Schema<IPurchaseItem, PurchaseItemModel>(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: 'Purchase',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    purchaseRate: {
      type: Number,
      required: true,
    },
    sellRate: {
      type: Number,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const PurchaseItem = model<IPurchaseItem, PurchaseItemModel>(
  'PurchaseItem',
  purchaseItemSchema
);
