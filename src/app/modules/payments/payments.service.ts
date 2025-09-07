"use client";

import { startSession } from "mongoose";
import { IPayment } from "./payments.interface";
import { Payment } from "./payments.model";
import { Sale } from "../sales/sales.model";

const createPayment = async (payload: IPayment): Promise<IPayment> => {
  const result = await Payment.create(payload);
  return result;
};

// ? due collection

const collectDueIntoDB = async (payload: Partial<IPayment>) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Insert payment
    payload.purpose = "due-collection";
    const result = await Payment.create([payload], { session });

    // Find sale
    const sale = await Sale.findOne({ invoice_no: payload.invoice_no }, null, {
      session,
    });

    if (!sale) {
      throw new Error("Sale not found for this invoice");
    }

    // Update paid and due
    const newPaid = (sale.paid ?? 0) + (payload.paid ?? 0);
    const newDue = (sale.netPayable ?? 0) - newPaid;

    await Sale.updateOne(
      { invoice_no: payload.invoice_no },
      { $set: { paid: newPaid, due: newDue } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllPayments = async (): Promise<IPayment[]> => {
  const result = await Payment.find({}).populate("orderId");
  return result;
};

const getSinglePayment = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findById(id).populate("orderId");
  return result;
};

const updatePayment = async (
  id: string,
  payload: Partial<IPayment>
): Promise<IPayment | null> => {
  const result = await Payment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePayment = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndDelete(id);
  return result;
};

export const PaymentService = {
  createPayment,
  collectDueIntoDB,
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
};
