import { Model, Types } from "mongoose";

export type IPayment = {
  invoice_no: string;

  amount: number;
  method: "cash" | "card" | "bkash" | "bank";
  status: "pending" | "completed" | "failed";
  paidAt: Date;
  posted_by: string;
};

export type PaymentModel = Model<IPayment, Record<string, unknown>>;
