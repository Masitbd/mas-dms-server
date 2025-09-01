import { generateSalesInvoiceNo } from "../../../utils/generateInvoiceNo";
import QueryBuilder from "../../builder/QueryBuilder";
import { Payment } from "../payments/payments.model";
import { salesableFields } from "./sales.constance";
import { ISale } from "./sales.interface";
import { Sale } from "./sales.model";

const createSale = async (payload: ISale): Promise<ISale> => {
  payload.invoice_no = await generateSalesInvoiceNo();

  const paymentres = await Payment.create(payload);
  payload.paymentId = paymentres._id as any;
  const result = await Sale.create(payload);
  return result;
};

const getAllSales = async (query: Record<string, any>) => {
  const salesQuery = new QueryBuilder(
    Sale.find({ isDeleted: false })
    .populate("medicines.medicineId", "name"),
    query
  )
    .search(salesableFields)
    .filter()
    .sort()
    .paginate();

  const result = await salesQuery.modelQuery;
  const meta = await salesQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSale = async (id: string): Promise<ISale | null> => {
  const result = await Sale.findOne({ _id: id, isDeleted: false })
    .populate("paymentId")
    .populate("medicines.medicineId", "name");
  return result;
};

const updateSale = async (
  id: string,
  payload: Partial<ISale>
): Promise<ISale | null> => {
  const result = await Sale.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteSale = async (id: string): Promise<ISale | null> => {
  const result = await Sale.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const SalesService = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
};
