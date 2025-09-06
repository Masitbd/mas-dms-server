import { PipelineStage } from "mongoose";

import { IMedicine } from "./medicines.interface";
import { Medicine } from "./medicines.model";

import { medicineSearchableFields } from "./medicine.constance";
import QueryBuilder from "../../builder/QueryBuilder";

const createMedicine = async (payload: IMedicine): Promise<IMedicine> => {
  const lastMedicine = await Medicine.findOne({}, { medicineId: 1 }).sort({
    createdAt: -1,
  });

  let newMedicineId = "00001";
  if (lastMedicine && lastMedicine.medicineId) {
    const lastId = parseInt(lastMedicine.medicineId);
    newMedicineId = (lastId + 1).toString().padStart(5, "0");
  }

  payload.medicineId = newMedicineId;

  const result = await Medicine.create(payload);
  return result;
};

const getAllMedicinesFromDB = async (query: Record<string, any>) => {
  const medicineQuery = new QueryBuilder(
    Medicine.find({ isDeleted: false }).select("medicineId name genericName"),
    query
  )
    .search(medicineSearchableFields)
    .sort()
    .paginate();

  const meta = await medicineQuery.countTotal();
  const data = await medicineQuery.modelQuery;
  return {
    meta,
    data,
  };
};

// wiht stock
const getAllMedicinesWithStockFromDB = async (query: Record<string, any>) => {
  const matchConditions: any = { isDeleted: false };

  // Handle search if provided
  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    matchConditions.$or = medicineSearchableFields.map((field) => ({
      [field]: searchRegex,
    }));
  }

  // Handle additional filters
  if (query.category) matchConditions.category = query.category;
  if (query.manufacturer) matchConditions.manufacturer = query.manufacturer;
  if (query.status) matchConditions.status = query.status;

  // Pagination setup
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 100;
  const skip = (page - 1) * limit;

  const aggregationPipeline: PipelineStage[] = [
    { $match: matchConditions },

    {
      $lookup: {
        from: "stocks",
        localField: "_id",
        foreignField: "productId",
        as: "stockData",
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoyData",
      },
    },
    { $unwind: { path: "$categoyData", preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        fifoPrice: {
          $first: {
            $map: {
              input: {
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$stockData",
                      cond: { $gt: ["$$this.currentQuantity", 0] },
                    },
                  },
                  sortBy: { expiryDate: 1, createdAt: 1 },
                },
              },
              as: "batch",
              // in: "$$batch.salesRate",
              in: {
                batchNo: "$$batch.batchNo",
                salesRate: "$$batch.salesRate",
              },
            },
          },
        },
      },
    },

    {
      $project: {
        medicineId: 1,
        discount: 1,
        name: 1,
        genericName: 1,
        unit: 1,
        openingBalance: 1,
        openingBalanceDate: 1,
        openingBalanceRate: 1,
        price: "$fifoPrice.salesRate",
        batchNo: "$fifoPrice.batchNo",
        currentStock: {
          $sum: "$stockData.currentQuantity",
        },
        category: "$categoyData.name",
      },
    },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [
          { $count: "total" },
          {
            $addFields: {
              page,
              limit,
              totalPages: {
                $ceil: { $divide: ["$total", limit] },
              },
            },
          },
        ],
      },
    },
  ];

  const result = Medicine.aggregate(aggregationPipeline);
  return result;
};

const getSingleMedicine = async (id: string): Promise<IMedicine | null> => {
  const result = await Medicine.findById(id)
    .populate("genericName")
    .populate("category")
    .populate("supplierName");
  return result;
};

const updateMedicine = async (
  id: string,
  payload: Partial<IMedicine>
): Promise<IMedicine | null> => {
  const result = await Medicine.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteMedicine = async (id: string): Promise<IMedicine | null> => {
  const result = await Medicine.findByIdAndDelete(id);
  return result;
};

export const MedicineService = {
  createMedicine,
  getAllMedicinesFromDB,
  getAllMedicinesWithStockFromDB,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
