import { Model, Types } from 'mongoose';

export type IOrderItem = {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  batchNo: string;
  quantity: number;
  price: number;
};

export type OrderItemModel = Model<IOrderItem, Record<string, unknown>>;
