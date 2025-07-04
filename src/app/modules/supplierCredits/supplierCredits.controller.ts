import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { SupplierCreditService } from './supplierCredits.service';
import sendResponse from '../../../shared/sendResponse';
import { ISupplierCredit } from './supplierCredits.interface';

const createSupplierCredit = catchAsync(async (req: Request, res: Response) => {
  const { ...supplierCreditData } = req.body;
  const result = await SupplierCreditService.createSupplierCredit(supplierCreditData);

  sendResponse<ISupplierCredit>(res, {
    statusCode: 201,
    success: true,
    message: 'Supplier credit created successfully',
    data: result,
  });
});

const getAllSupplierCredits = catchAsync(async (req: Request, res: Response) => {
  const result = await SupplierCreditService.getAllSupplierCredits();

  sendResponse<ISupplierCredit[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier credits retrieved successfully',
    data: result,
  });
});

const getSingleSupplierCredit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SupplierCreditService.getSingleSupplierCredit(id);

  sendResponse<ISupplierCredit>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier credit retrieved successfully',
    data: result,
  });
});

const updateSupplierCredit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await SupplierCreditService.updateSupplierCredit(id, updatedData);

  sendResponse<ISupplierCredit>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier credit updated successfully',
    data: result,
  });
});

const deleteSupplierCredit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SupplierCreditService.deleteSupplierCredit(id);

  sendResponse<ISupplierCredit>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier credit deleted successfully',
    data: result,
  });
});

export const SupplierCreditController = {
  createSupplierCredit,
  getAllSupplierCredits,
  getSingleSupplierCredit,
  updateSupplierCredit,
  deleteSupplierCredit,
};
