import { Schema, model } from 'mongoose';
import { IPurchaseReturn, PurchaseReturnModel } from './purchaseReturns.interface';

const purchaseReturnSchema = new Schema<IPurchaseReturn, PurchaseReturnModel>(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: 'Purchase',
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    totalRefund: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export const PurchaseReturn = model<IPurchaseReturn, PurchaseReturnModel>(
  'PurchaseReturn',
  purchaseReturnSchema
);
