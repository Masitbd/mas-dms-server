import { Model, Types } from "mongoose";

export type IPayment = {
  orderId: Types.ObjectId;
  orderIdModel: "Sale" | "Order";

  amount: number;
  method: "cash" | "card" | "bkash" | "bank";
  status: "pending" | "completed" | "failed";
  paidAt: Date;
};

export type PaymentModel = Model<IPayment, Record<string, unknown>>;
