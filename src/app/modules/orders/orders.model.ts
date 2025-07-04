import { Schema, model } from 'mongoose';
import { IOrder, OrderModel } from './orders.interface';

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: false,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
