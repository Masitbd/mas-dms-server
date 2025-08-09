import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { Category } from "./mCategory.model";
import { TMCategoryAndGeneric } from "./mCategory.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createCategoryIntoDB = async (payload: TMCategoryAndGeneric) => {
  const lastCategory = await Category.findOne({}, { categoryId: 1 }).sort({
    createdAt: -1,
  });

  let newCategoryId = "00001";
  if (lastCategory && lastCategory.categoryId) {
    const lastId = parseInt(lastCategory.categoryId);
    newCategoryId = (lastId + 1).toString().padStart(5, "0");
  }

  payload.categoryId = newCategoryId;

  return Category.create(payload);
};

const getAllCategoriesFromDB = async (
  query: Record<string, unknown>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<TMCategoryAndGeneric[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const categorySearchableFields = ["name", "categoryId"];

  const categoryQuery = new QueryBuilder(Category.find(), {
    ...query,
    sortBy,
    sortOrder,
    page,
    limit,
    skip,
  })
    .sort()
    .paginate()
    .search(categorySearchableFields);

  const result = await categoryQuery.modelQuery;

  const meta = {
    page,
    limit,
    total: await Category.countDocuments(),
  };

  return {
    meta,
    data: result,
  };
};

const getSingleCategoryFromDB = async (id: string) => {
  return Category.findById(id);
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TMCategoryAndGeneric>
) => {
  return Category.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCategoryFromDB = async (id: string) => {
  return Category.findByIdAndDelete(id);
};

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
