import { Model, Types } from 'mongoose';
import { IPurchaseItem } from '../purchaseItems/purchaseItems.interface';

export type IPurchase = {
  invoiceNo: string;
  supplierId: Types.ObjectId;
  purchaseDate: Date;
  totalAmount: number;
  paidAmount: number;
  status: 'due' | 'partial' | 'paid';
  createdBy: Types.ObjectId;
  purchaseItems: IPurchaseItem[];
};

export type PurchaseModel = Model<IPurchase, Record<string, unknown>>;

