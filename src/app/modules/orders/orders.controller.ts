import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OrderService } from './orders.service';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './orders.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse<IOrder>(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();

  sendResponse<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.getSingleOrder(id);

  sendResponse<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await OrderService.updateOrder(id, updatedData);

  sendResponse<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.deleteOrder(id);

  sendResponse<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
