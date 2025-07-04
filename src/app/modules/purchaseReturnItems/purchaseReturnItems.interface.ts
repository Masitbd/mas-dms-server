import { Model, Types } from 'mongoose';

export type IPurchaseReturnItem = {
  returnId: Types.ObjectId;
  purchaseItemId: Types.ObjectId;
  quantityReturned: number;
  refundAmount: number;
  comment?: string;
};

export type PurchaseReturnItemModel = Model<IPurchaseReturnItem, Record<string, unknown>>;
