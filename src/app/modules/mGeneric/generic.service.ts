import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { Generic } from "./generic.model";
import { TGeneric } from "./generic.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createGenericIntoDB = async (payload: TGeneric) => {
  const lastGeneric = await Generic.findOne({}, { genericId: 1 }).sort({
    createdAt: -1,
  });

  let newGenericId = "00001";
  if (lastGeneric && lastGeneric.genericId) {
    const lastId = parseInt(lastGeneric.genericId);
    newGenericId = (lastId + 1).toString().padStart(5, "0");
  }

  payload.genericId = newGenericId;

  return Generic.create(payload);
};

const getAllGenericsFromDB = async (
  query: Record<string, unknown>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<TGeneric[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const genericSearchableFields = ["name", "genericId"];

  const genericQuery = new QueryBuilder(Generic.find(), {
    ...query,
    sortBy,
    sortOrder,
    page,
    limit,
    skip,
  })
    .sort()
    .paginate()
    .search(genericSearchableFields);

  const result = await genericQuery.modelQuery;
  const meta = {
    page,
    limit,
    total: await Generic.countDocuments(),
  };

  return {
    meta,
    data: result,
  };
};

const getSingleGenericFromDB = async (id: string) => {
  return Generic.findById(id);
};

const updateGenericIntoDB = async (id: string, payload: Partial<TGeneric>) => {
  return Generic.findByIdAndUpdate(id, payload, { new: true });
};

const deleteGenericFromDB = async (id: string) => {
  return Generic.findByIdAndDelete(id);
};

export const genericServices = {
  createGenericIntoDB,
  getAllGenericsFromDB,
  getSingleGenericFromDB,
  updateGenericIntoDB,
  deleteGenericFromDB,
};
