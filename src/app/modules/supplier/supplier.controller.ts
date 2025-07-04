import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { SupplierService } from './supplier.service';
import sendResponse from '../../../shared/sendResponse';
import { ISupplier } from './supplier.interface';

const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const { ...supplierData } = req.body;
  const result = await SupplierService.createSupplier(supplierData);

  sendResponse<ISupplier>(res, {
    statusCode: 201,
    success: true,
    message: 'Supplier created successfully',
    data: result,
  });
});

const getAllSuppliers = catchAsync(async (req: Request, res: Response) => {
  const result = await SupplierService.getAllSuppliers();

  sendResponse<ISupplier[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Suppliers retrieved successfully',
    data: result,
  });
});

const getSingleSupplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SupplierService.getSingleSupplier(id);

  sendResponse<ISupplier>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier retrieved successfully',
    data: result,
  });
});

const updateSupplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await SupplierService.updateSupplier(id, updatedData);

  sendResponse<ISupplier>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier updated successfully',
    data: result,
  });
});

const deleteSupplier = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SupplierService.deleteSupplier(id);

  sendResponse<ISupplier>(res, {
    statusCode: 200,
    success: true,
    message: 'Supplier deleted successfully',
    data: result,
  });
});

export const SupplierController = {
  createSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};