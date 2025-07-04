import { IOrder } from './orders.interface';
import { Order } from './orders.model';

const createOrder = async (payload: IOrder): Promise<IOrder> => {
  const result = await Order.create(payload);
  return result;
};

const getAllOrders = async (): Promise<IOrder[]> => {
  const result = await Order.find({}).populate('userId').populate('paymentId');
  return result;
};

const getSingleOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id).populate('userId').populate('paymentId');
  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>
): Promise<IOrder | null> => {
  const result = await Order.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
