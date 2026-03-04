import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import {
  getDueCollectionStatemntFromDB,
  getDueCollectionSummeryFromDB,
  getMedicineExpiryStatementFromDB,
  getMedicineIncomeStatementSummaryFromDB,
  getMedicineProfitLossFromDB,
  getMedicineSalesStatemntFromDB,
  getMedicineStockRecordFromDB,
  getMedicineStockStatementFromDB,
  getPatientDueSummeryFromDB,
  getPatientSaleDueStatementFromDB,
} from "./reports.service";
import sendResponse from "../../../utils/sendResponse";

export const getMedicineSalesStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineSalesStatemntFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Report Retrive successfully",
      data: result,
    });
  }
);
export const getDueCollectionStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getDueCollectionStatemntFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Due collection Report Retrive successfully",
      data: result,
    });
  }
);
export const getDueCollectionSummery = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getDueCollectionSummeryFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Due collection  summery Report Retrive successfully",
      data: result,
    });
  }
);
export const getPatientSaleDueStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getPatientSaleDueStatementFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Due collection  patient Report Retrive successfully",
      data: result,
    });
  }
);
export const getPatientDueSummery = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getPatientDueSummeryFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Due collection  patient Report Retrive successfully",
      data: result,
    });
  }
);
export const getMedicineProfitLoss = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineProfitLossFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Profit loss Report Retrive successfully",
      data: result,
    });
  }
);
export const getMedicineStockRecord = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineStockRecordFromDB();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Medicine stock Report Retrive successfully",
      data: result,
    });
  }
);

export const getMedicineStockStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineStockStatementFromDB();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Medicine stock statement report retrive successfully",
      data: result,
    });
  }
);

export const getMedicineExpiryStatement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineExpiryStatementFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Medicine expiry statement report retrive successfully",
      data: result,
    });
  }
);

export const getMedicineIncomeStatementSummary = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getMedicineIncomeStatementSummaryFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Medicine income statement summary report retrive successfully",
      data: result,
    });
  }
);
