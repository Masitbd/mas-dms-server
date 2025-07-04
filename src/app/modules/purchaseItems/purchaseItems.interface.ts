import { Model, Types } from 'mongoose';

export type IPurchaseItem = {
  purchaseId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  purchaseRate: number;
  sellRate: number;
  batchNo: string;
  expiryDate: Date;
};

export type PurchaseItemModel = Model<IPurchaseItem, Record<string, unknown>>;
