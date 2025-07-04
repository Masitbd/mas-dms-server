import { Model, Types } from 'mongoose';

export type ISale = {
  userId: Types.ObjectId;
  orderDate: Date;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: Types.ObjectId; // optional
  shippingAddress: string;
};

export type SaleModel = Model<ISale, Record<string, unknown>>;
