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
        localField: "invoice_no",
        foreignField: "invoice_no",
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
        discountAmount: 1,
        totalBill: 1,
        due: 1,
        // totalPaid: 1,
        totalDiscount: 1,
        extraDiscount: 1,
        advanceAmount: 1,
        netPayable: 1,
        createdAt: 1,
        "paymentDetails.paid": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        totalBill: { $sum: "$totalBill" },
        totalDiscount: { $sum: "$totalDiscount" },
        totalNetPayable: { $sum: "$netPayable" },
        totalPaid: { $sum: "$paymentDetails.paid" },
        totalDue: { $sum: "$due" },
      },
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
        purpose: 1,
        paid: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: null,
        records: { $first: "$$ROOT" },
        totalBill: { $sum: "$paid" },
      },
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
    purpose: "due-collection",
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
        due: 1,
        posted_by: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: "$posted_by",
        latestInvoice: { $first: "$$ROOT" },
        totalDueCollection: { $sum: "$paid" },
      },
    },
    {
      $project: {
        _id: 0,
        posted_by: "$_id",
        invoice_no: "$latestInvoice.invoice_no",
        createdAt: "$latestInvoice.createdAt",
        paid: "$latestInvoice.paid",
        totalDueCollection: 1,
      },
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
        due: 1,
        // posted_by: 1,
        bed: "$bedDetails?.name",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" }, // keep all documents
        totalBill: { $sum: "$totalBill" },
        totalPaid: { $sum: "$paid" },
        totalDiscount: { $sum: "$totalDiscount" },
        totalNetPayable: { $sum: "$netPayable" },
        totalDue: { $sum: "$due" },
      },
    },
  ];

  return await Sale.aggregate(query);
};
