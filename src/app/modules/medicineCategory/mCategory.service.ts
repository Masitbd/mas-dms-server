import { SortOrder } from "mongoose";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { Category } from "./mCategory.model";
import { TMCategoryAndGeneric } from "./mCategory.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createCategoryIntoDB = async (payload: TMCategoryAndGeneric) => {
  return Category.create(payload);
};

const getAllCategoriesFromDB = async (
  query: Record<string, unknown>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<TMCategoryAndGeneric[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const categorySearchableFields = ["name", "categoryId"];

  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(categorySearchableFields)
    .filter()
    .sort(sortBy, sortOrder as SortOrder)
    .paginate(page, limit, skip)
    .fields();

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
