import { IOrderItem } from './orderItems.interface';
import { OrderItem } from './orderItems.model';

const createOrderItem = async (payload: IOrderItem): Promise<IOrderItem> => {
  const result = await OrderItem.create(payload);
  return result;
};

const getAllOrderItems = async (): Promise<IOrderItem[]> => {
  const result = await OrderItem.find({}).populate('orderId').populate('productId');
  return result;
};

const getSingleOrderItem = async (id: string): Promise<IOrderItem | null> => {
  const result = await OrderItem.findById(id).populate('orderId').populate('productId');
  return result;
};

const updateOrderItem = async (
  id: string,
  payload: Partial<IOrderItem>
): Promise<IOrderItem | null> => {
  const result = await OrderItem.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteOrderItem = async (id: string): Promise<IOrderItem | null> => {
  const result = await OrderItem.findByIdAndDelete(id);
  return result;
};

export const OrderItemService = {
  createOrderItem,
  getAllOrderItems,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
