import { Model, Types } from 'mongoose';

export type IStock = {
  productId: Types.ObjectId;
  purchaseItemId: Types.ObjectId;
  batchNo: string;
  expiryDate: Date;
  quantityIn: number;
  quantityOut: number;
  currentQuantity: number;
};

export type StockModel = Model<IStock, Record<string, unknown>>;
