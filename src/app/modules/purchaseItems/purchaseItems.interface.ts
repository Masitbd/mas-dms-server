import { Model, Types } from "mongoose";

export type IPurchaseItem = {
  purchaseItemId: string;
  purchaseId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  purchaseRate: number;
  sellRate: number;
  batchNo: string;
  expiryDate: Date;
  medicineName: Types.ObjectId;
  salesRate: Number;
  dateExpire: Date;
};

export type PurchaseItemModel = Model<IPurchaseItem, Record<string, unknown>>;
