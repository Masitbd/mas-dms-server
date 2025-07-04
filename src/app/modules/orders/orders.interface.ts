import { Model, Types } from 'mongoose';

export type IOrder = {
  userId: Types.ObjectId;
  orderDate: Date;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: Types.ObjectId; // reference to payment if any
  shippingAddress: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
