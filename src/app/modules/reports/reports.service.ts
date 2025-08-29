import { PipelineStage } from "mongoose";
import { Sale } from "../sales/sales.model";
import { Payment } from "../payments/payments.model";

export const getMedicineSalesStatemntFromDB = async (
  payload: Record<string, any>
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },
    {
      $unwind: {
        path: "$paymentDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,
        name: 1,
        invoice_no: 1,
        createdAt: 1,
        paymentInfo: "$paymentDetails",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  const result = await Sale.aggregate(query);
  return { result };
};
export const getDueCollectionStatemntFromDB = async (
  payload: Record<string, any>
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const query: PipelineStage[] = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  const result = await Payment.aggregate(query);
  return { result };
};
