import { Schema, model } from 'mongoose';
import { IOrderItem, OrderItemModel } from './orderItems.interface';

const orderItemSchema = new Schema<IOrderItem, OrderItemModel>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    batchNo: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
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

export const OrderItem = model<IOrderItem, OrderItemModel>(
  'OrderItem',
  orderItemSchema
);
