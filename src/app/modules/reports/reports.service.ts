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

  return await Sale.aggregate(query);
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

  return await Payment.aggregate(query);
};
export const getDueCollectionSummeryFromDB = async (
  payload: Record<string, any>
) => {
  // Default to current date if no startDate and endDate are provided
  const startDate = payload.startDate
    ? new Date(payload.startDate)
    : new Date();
  const endDate = payload.endDate ? new Date(payload.endDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const match: Record<string, any> = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (payload.userId) {
    match.posted_by = payload.userId;
  }

  const query: PipelineStage[] = [
    {
      $match: match,
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
        posted_by: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  return await Payment.aggregate(query);
};

export const getPatientSaleDueStatementFromDB = async (
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
        $expr: { $lt: ["$paid", "$netPayable"] },
      },
    },

    {
      $lookup: {
        from: "sales",
        localField: "invoice_no",
        foreignField: "invoice_no",
        as: "salesDetails",
      },
    },
    {
      $unwind: {
        path: "$salesDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "beds",
        localField: "bed_no",
        foreignField: "_id",
        as: "bedDetails",
      },
    },
    {
      $unwind: {
        path: "$bedDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        paid: 1,
        posted_by: 1,
        totalBill: 1,
        totalDiscount: 1,
        netPayable: 1,
        bed: "$bedDetails?.name",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  return await Payment.aggregate(query);
};
