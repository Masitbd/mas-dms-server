import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payments.service';
import sendResponse from '../../../shared/sendResponse';
import { IPayment } from './payments.interface';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { ...paymentData } = req.body;
  const result = await PaymentService.createPayment(paymentData);

  sendResponse<IPayment>(res, {
    statusCode: 201,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();

  sendResponse<IPayment[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.getSinglePayment(id);

  sendResponse<IPayment>(res, {
    statusCode: 200,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await PaymentService.updatePayment(id, updatedData);

  sendResponse<IPayment>(res, {
    statusCode: 200,
    success: true,
    message: 'Payment updated successfully',
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.deletePayment(id);

  sendResponse<IPayment>(res, {
    statusCode: 200,
    success: true,
    message: 'Payment deleted successfully',
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  getAllPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
};
