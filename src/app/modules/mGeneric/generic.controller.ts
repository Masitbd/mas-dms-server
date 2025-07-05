import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { genericServices } from "./generic.service";
import pick from "../../../shared/pick";

const createGeneric = catchAsync(async (req: Request, res: Response) => {
  const result = await genericServices.createGenericIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generic Created",
    data: result,
  });
});

const getAllGenerics = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await genericServices.getAllGenericsFromDB(
    req.query,
    paginationOptions
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generics Retrieved",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGeneric = catchAsync(async (req: Request, res: Response) => {
  const result = await genericServices.getSingleGenericFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generic Retrieved",
    data: result,
  });
});

const updateGeneric = catchAsync(async (req: Request, res: Response) => {
  const result = await genericServices.updateGenericIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generic Updated",
    data: result,
  });
});

const deleteGeneric = catchAsync(async (req: Request, res: Response) => {
  const result = await genericServices.deleteGenericFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Medicine Generic Deleted",
    data: result,
  });
});

export const genericControllers = {
  createGeneric,
  getAllGenerics,
  getSingleGeneric,
  updateGeneric,
  deleteGeneric,
};
