import { Schema, model } from 'mongoose';
import { ISupplierCredit, SupplierCreditModel } from './supplierCredits.interface';

const supplierCreditSchema = new Schema<ISupplierCredit, SupplierCreditModel>(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    returnId: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseReturn',
      required: true,
    },
    creditAmount: {
      type: Number,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    usedOnPayment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const SupplierCredit = model<ISupplierCredit, SupplierCreditModel>(
  'SupplierCredit',
  supplierCreditSchema
);
