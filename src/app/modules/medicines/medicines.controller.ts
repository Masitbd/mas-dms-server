import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { MedicineService } from './medicines.service';
import sendResponse from '../../../shared/sendResponse';
import { IMedicine } from './medicines.interface';

const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const { ...medicineData } = req.body;
  const result = await MedicineService.createMedicine(medicineData);

  sendResponse<IMedicine>(res, {
    statusCode: 201,
    success: true,
    message: 'Medicine created successfully',
    data: result,
  });
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineService.getAllMedicines();

  sendResponse<IMedicine[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Medicines retrieved successfully',
    data: result,
  });
});

const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineService.getSingleMedicine(id);

  sendResponse<IMedicine>(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine retrieved successfully',
    data: result,
  });
});

const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...updatedData } = req.body;
  const result = await MedicineService.updateMedicine(id, updatedData);

  sendResponse<IMedicine>(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine updated successfully',
    data: result,
  });
});

const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineService.deleteMedicine(id);

  sendResponse<IMedicine>(res, {
    statusCode: 200,
    success: true,
    message: 'Medicine deleted successfully',
    data: result,
  });
});

export const MedicineController = {
  createMedicine,
  getAllMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
