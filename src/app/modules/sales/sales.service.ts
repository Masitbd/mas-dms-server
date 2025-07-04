import { ISale } from './sales.interface';
import { Sale } from './sales.model';

const createSale = async (payload: ISale): Promise<ISale> => {
  const result = await Sale.create(payload);
  return result;
};

const getAllSales = async (): Promise<ISale[]> => {
  const result = await Sale.find({}).populate('userId').populate('paymentId');
  return result;
};

const getSingleSale = async (id: string): Promise<ISale | null> => {
  const result = await Sale.findById(id).populate('userId').populate('paymentId');
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
  const result = await Sale.findByIdAndDelete(id);
  return result;
};

export const SalesService = {
  createSale,
  getAllSales,
  getSingleSale,
  updateSale,
  deleteSale,
};
