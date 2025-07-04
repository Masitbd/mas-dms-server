import { Model, Types } from 'mongoose';

export type IPurchaseReturn = {
  purchaseId: Types.ObjectId;
  returnDate: Date;
  totalRefund: number;
  reason: string;
  createdBy: Types.ObjectId;
};

export type PurchaseReturnModel = Model<IPurchaseReturn, Record<string, unknown>>;
