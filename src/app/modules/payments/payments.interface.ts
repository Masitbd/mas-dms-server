import { Model, Types } from 'mongoose';

export type IPayment = {
  orderId: Types.ObjectId;
  amount: number;
  method: 'cash' | 'card' | 'bkash' | 'bank';
  status: 'pending' | 'completed' | 'failed';
  paidAt: Date;
};

export type PaymentModel = Model<IPayment, Record<string, unknown>>;
