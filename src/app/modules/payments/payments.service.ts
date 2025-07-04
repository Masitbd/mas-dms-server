import { IPayment } from "./payments.interface";
import { Payment } from "./payments.model";

const createPayment = async (payload: IPayment): Promise<IPayment> => {
  const result = await Payment.create(payload);
  return result;
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
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
};
