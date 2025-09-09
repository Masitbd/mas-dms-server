import { Types } from "mongoose";
import { IPurchasePayment } from "./purchasePayments.interface";
import { PurchasePayment } from "./purchasePayments.model";
import { Purchase } from "../purchases/purchases.model";
import AppError from "../../errors/APiError";
import { STATUS_CODES } from "http";
import { HttpStatusCode } from "axios";

const createPurchasePayment = async (
  payload: IPurchasePayment
): Promise<IPurchasePayment> => {
  const purchaseData = await Purchase.findOne({
    _id: new Types.ObjectId(payload?.purchaseId),
  });

  if (!purchaseData) {
    throw new AppError(HttpStatusCode.NotFound, "Purchase Not Found");
  }
  await Purchase.findOneAndUpdate(
    { _id: new Types.ObjectId(payload.purchaseId) },
    {
      paidAmount: Number(purchaseData?.paidAmount) + payload.amount,
      status:
        purchaseData?.netPayable === purchaseData?.paidAmount + payload.amount
          ? "paid"
          : "due",
    }
  );
  const result = await PurchasePayment.create(payload);

  return result;
};

const getAllPurchasePayments = async (): Promise<IPurchasePayment[]> => {
  const result = await PurchasePayment.find({}).populate("purchaseId");
  return result;
};

const getSinglePurchasePayment = async (
  id: string
): Promise<IPurchasePayment[] | null> => {
  const result = await PurchasePayment.find({
    purchaseId: new Types.ObjectId(id),
  });
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

const deletePurchasePayment = async (
  id: string
): Promise<IPurchasePayment | null> => {
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
