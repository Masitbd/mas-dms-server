import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OrderItemService } from './orderItems.service';
import sendResponse from '../../../shared/sendResponse';
import { IOrderItem } from './orderItems.interface';

const createOrderItem = catchAsync(async (req: Request, res: Response) => {
  const { ...orderItemData } = req.body;
  const result = await OrderItemService.createOrderItem(orderItemData);

  sendResponse<IOrderItem>(res, {
    statusCode: 201,
    success: true,
    message: 'Order item created successfully',
    data: result,
  });
});

const getAllOrderItems = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderItemService.getAllOrderItems();

  sendResponse<IOrderItem[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Order items retrieved successfully',
    data: result,
  });
});

const getSingleOrderItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderItemService.getSingleOrderItem(id);

  sendResponse<IOrderItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Order item retrieved successfully',
    data: result,
  });
});

const updateOrderItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await OrderItemService.updateOrderItem(id, updatedData);

  sendResponse<IOrderItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Order item updated successfully',
    data: result,
  });
});

const deleteOrderItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderItemService.deleteOrderItem(id);

  sendResponse<IOrderItem>(res, {
    statusCode: 200,
    success: true,
    message: 'Order item deleted successfully',
    data: result,
  });
});

export const OrderItemController = {
  createOrderItem,
  getAllOrderItems,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
