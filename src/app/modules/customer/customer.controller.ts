// src/modules/customer/customer.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import pick from "../../../shared/pick";
import { customerServices } from "./customer.services";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await customerServices.createCustomerIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customer Created",
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  // keep same style: use pick for query params
  const query = pick(req.query, ["searchTerm", "page", "limit", "onlyActive"]);

  const result = await customerServices.getAllCustomersFromDB(query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customers Retrieved",
    data: result,
  });
});

const getSingleCustomer = catchAsync(async (req: Request, res: Response) => {
  const { uuid } = req.params;

  const result = await customerServices.getSingleCustomerFromDB(uuid);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customer Retrieved",
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { uuid } = req.params;

  const result = await customerServices.updateCustomerIntoDB(uuid, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customer Updated",
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { uuid } = req.params;

  const result = await customerServices.deleteCustomerFromDB(uuid);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Customer Deleted",
    data: result,
  });
});

export const customerControllers = {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
