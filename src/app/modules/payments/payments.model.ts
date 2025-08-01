import { Schema, model } from "mongoose";
import { IPayment, PaymentModel } from "./payments.interface";

const paymentSchema = new Schema<IPayment, PaymentModel>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      refPath: "orderIdModel",
      required: true,
    },
    orderIdModel: {
      type: String,
      required: true,
      enum: ["Sale", "Order"],
      default: "Order",
    },
 
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "card", "bkash", "bank"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paidAt: {
      type: Date,
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

export const Payment = model<IPayment, PaymentModel>("Payment", paymentSchema);
