import { startSession } from "mongoose";
import { generateSalesInvoiceNo } from "../../../utils/generateInvoiceNo";
import QueryBuilder from "../../builder/QueryBuilder";
import { Payment } from "../payments/payments.model";
import { salesableFields } from "./sales.constance";
import { ISale } from "./sales.interface";
import { Sale } from "./sales.model";
import { Stock } from "../stock/stock.model";

const createSale = async (payload: ISale): Promise<ISale> => {
  const session = await startSession();
  session.startTransaction();
  try {
    payload.invoice_no = await generateSalesInvoiceNo();

    await Payment.create([payload], { session });

    const [result] = await Sale.create([payload], { session });

    //! stock out from stock

    for (const item of result?.medicines) {
      await Stock.findOneAndUpdate(
        { productId: item.medicineId },
        {
          $inc: { currentQuantity: -item.quantity },
        },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllSales = async (query: Record<string, any>) => {
  const salesQuery = new QueryBuilder(
    Sale.find({ isDeleted: false }).populate("medicines.medicineId", "name"),
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
