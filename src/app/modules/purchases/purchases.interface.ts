import { Model, Types } from 'mongoose';

export type IPurchase = {
  invoiceNo: string;
  supplierId: Types.ObjectId;
  purchaseDate: Date;
  totalAmount: number;
  paidAmount: number;
  status: 'due' | 'partial' | 'paid';
  createdBy: Types.ObjectId;
};

export type PurchaseModel = Model<IPurchase, Record<string, unknown>>;
