import { Model, Types } from 'mongoose';

export type ISupplierCredit = {
  supplierId: Types.ObjectId;
  returnId: Types.ObjectId;
  creditAmount: number;
  used: boolean;
  usedOnPayment?: Types.ObjectId | null;
};

export type SupplierCreditModel = Model<ISupplierCredit, Record<string, unknown>>;
