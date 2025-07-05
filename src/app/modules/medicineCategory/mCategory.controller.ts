import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { categoryServices } from "./mCategory.service";
import pick from "../../../shared/pick";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.createCategoryIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Created",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await categoryServices.getAllCategoriesFromDB(
    req.query,
    paginationOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Categories Retrieved",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.getSingleCategoryFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Retrieved",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.updateCategoryIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Updated",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.deleteCategoryFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Category Deleted",
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
