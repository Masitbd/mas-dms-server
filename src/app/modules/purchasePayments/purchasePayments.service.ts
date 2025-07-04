import { IPurchasePayment } from './purchasePayments.interface';
import { PurchasePayment } from './purchasePayments.model';

const createPurchasePayment = async (payload: IPurchasePayment): Promise<IPurchasePayment> => {
  const result = await PurchasePayment.create(payload);
  return result;
};

const getAllPurchasePayments = async (): Promise<IPurchasePayment[]> => {
  const result = await PurchasePayment.find({}).populate('purchaseId');
  return result;
};

const getSinglePurchasePayment = async (id: string): Promise<IPurchasePayment | null> => {
  const result = await PurchasePayment.findById(id).populate('purchaseId');
  return result;
};

const updatePurchasePayment = async (
  id: string,
  payload: Partial<IPurchasePayment>
): Promise<IPurchasePayment | null> => {
  const result = await PurchasePayment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchasePayment = async (id: string): Promise<IPurchasePayment | null> => {
  const result = await PurchasePayment.findByIdAndDelete(id);
  return result;
};

export const PurchasePaymentService = {
  createPurchasePayment,
  getAllPurchasePayments,
  getSinglePurchasePayment,
  updatePurchasePayment,
  deletePurchasePayment,
};
