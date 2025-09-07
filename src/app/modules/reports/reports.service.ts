import { PipelineStage } from "mongoose";
import { Sale } from "../sales/sales.model";
import { Payment } from "../payments/payments.model";
import { Stock } from "../stock/stock.model";

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
      $lookup: {
        from: "sales",
        localField: "invoice_no",
        foreignField: "invoice_no",
        as: "salesInfo",
      },
    },

    {
      $unwind: {
        path: "$salesInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        invoice_no: 1,
        createdAt: 1,
        purpose: 1,
        paid: 1,
        totalBill: "$salesInfo.totalBill",
        netPayable: "$salesInfo.netPayable",
        totalPaid: "$salesInfo.paid",
        totalDue: "$salesInfo.due",
      },
    },

    {
      $sort: { createdAt: -1 },
    },

    {
      $group: {
        _id: null,
        records: { $push: "$$ROOT" },
        grandTotal: { $sum: "$paid" },
      },
    },
  ];

  const [result] = await Payment.aggregate(query);
  return result;
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

// ? All Patient due summery

export const getPatientDueSummeryFromDB = async (
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
        _id: "$invoice_no",
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

//? stock reports

export const getMedicineStockRecordFromDB = async (page = 1, limit = 100) => {
  const skip = (page - 1) * limit;

  // Step 1: Count total distinct products with available stock
  const totalDocsAgg = await Stock.aggregate([
    { $match: { currentQuantity: { $gt: 0 } } },
    { $group: { _id: "$productId" } },
    { $count: "totalDocs" },
  ]);

  const totalDocs = totalDocsAgg[0]?.totalDocs || 0;
  const totalPages = Math.ceil(totalDocs / limit);

  // Step 2: Fetch paginated products with FIFO
  const records = await Stock.aggregate([
    { $match: { currentQuantity: { $gt: 0 } } },

    // populate product
    {
      $lookup: {
        from: "medicines",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "productCategory",
      },
    },
    { $unwind: "$productCategory" },

    // populate purchase item
    {
      $lookup: {
        from: "purchaseitems",
        localField: "purchaseItemId",
        foreignField: "_id",
        as: "purchaseItem",
      },
    },
    { $unwind: "$purchaseItem" },

    // sort by oldest batch first (FIFO)
    { $sort: { createdAt: 1 } },

    // group by product, pick the first batch with stock
    {
      $group: {
        _id: "$product._id",
        medicineName: { $first: "$product.name" },
        medicineCategory: { $first: "$productCategory.name" },
        currentQty: { $sum: "$currentQuantity" }, // total available stock
        qtyIn: { $first: "$quantityIn" }, // qty in first batch
        purchaseRate: { $first: "$purchaseItem.purchaseRate" },
        salesRate: { $first: "$purchaseItem.salesRate" },
      },
    },

    // pagination
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = {
    totalDocs,
    limit,
    page,
    totalPages,
  };

  return { records, meta };
};

// ?

export const getMedicineProfitLossFromDB = async (
  payload: Record<string, any>
) => {
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

  const agreegatePipeline: PipelineStage[] = [
    {
      $match: match,
    },
    { $unwind: "$medicines" },
    {
      $lookup: {
        from: "purchaseitems",
        localField: "medicines.batchNo",
        foreignField: "batchNo",
        as: "purchaseInfo",
      },
    },
    {
      $unwind: { path: "$purchaseInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "medicines",
        localField: "medicines.medicineId",
        foreignField: "_id",
        as: "medicineInfo",
      },
    },
    {
      $unwind: { path: "$medicineInfo", preserveNullAndEmptyArrays: true },
    },

    {
      $project: {
        name: "$medicineInfo.name",
        qty: "$medicines.quantity",
        salesRate: "$medicines.unit_price",
        discount: "$medicines.discount",
        purchaseRate: "$purchaseInfo.purchaseRate",
      },
    },
  ];

  const result = await Sale.aggregate(agreegatePipeline);

  return result;
};
