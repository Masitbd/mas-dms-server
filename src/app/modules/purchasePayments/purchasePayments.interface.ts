import { Model, Types } from 'mongoose';

export type IPurchasePayment = {
  purchaseId: Types.ObjectId;
  paymentDate: Date;
  amount: number;
  method: 'cash' | 'card' | 'bkash' | 'bank';
  note?: string;
};

export type PurchasePaymentModel = Model<IPurchasePayment, Record<string, unknown>>;
