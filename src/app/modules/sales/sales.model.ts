import { Schema, model } from 'mongoose';
import { ISale, SaleModel } from './sales.interface';

const salesSchema = new Schema<ISale, SaleModel>(
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

export const Sale = model<ISale, SaleModel>('Sale', salesSchema);
