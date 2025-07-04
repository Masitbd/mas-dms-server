import { Schema, model } from 'mongoose';
import { IPurchaseReturnItem, PurchaseReturnItemModel } from './purchaseReturnItems.interface';

const purchaseReturnItemSchema = new Schema<IPurchaseReturnItem, PurchaseReturnItemModel>(
  {
    returnId: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseReturn',
      required: true,
    },
    purchaseItemId: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseItem',
      required: true,
    },
    quantityReturned: {
      type: Number,
      required: true,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    comment: {
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

export const PurchaseReturnItem = model<IPurchaseReturnItem, PurchaseReturnItemModel>(
  'PurchaseReturnItem',
  purchaseReturnItemSchema
);
