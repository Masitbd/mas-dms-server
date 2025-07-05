import { SortOrder } from "mongoose";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { ISupplier } from './supplier.interface';
import { Supplier } from './supplier.model';
import QueryBuilder from "../../builder/QueryBuilder";

const createSupplier = async (payload: ISupplier): Promise<ISupplier> => {
  const lastSupplier = await Supplier.findOne({}, { supplierId: 1 }).sort({
    createdAt: -1,
  });

  let newSupplierId = "00001";
  if (lastSupplier && lastSupplier.supplierId) {
    const lastId = parseInt(lastSupplier.supplierId);
    newSupplierId = (lastId + 1).toString().padStart(5, "0");
  }

  payload.supplierId = newSupplierId;

  const result = await Supplier.create(payload);
  return result;
};

const getAllSuppliers = async (
  query: Record<string, unknown>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ISupplier[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const supplierSearchableFields = ["name", "supplierId", "contactPerson", "phone", "email", "city", "country"];

  const supplierQuery = new QueryBuilder(Supplier.find(), query)
    .search(supplierSearchableFields)
    .filter()
    .sort(sortBy, sortOrder as SortOrder)
    .paginate(page, limit, skip)
    .fields();

  const result = await supplierQuery.modelQuery;
  const meta = {
    page,
    limit,
    total: await Supplier.countDocuments(),
  };

  return {
    meta,
    data: result,
  };
};

const getSingleSupplier = async (id: string): Promise<ISupplier | null> => {
  const result = await Supplier.findById(id);
  return result;
};

const updateSupplier = async (
  id: string,
  payload: Partial<ISupplier>
): Promise<ISupplier | null> => {
  const result = await Supplier.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSupplier = async (id: string): Promise<ISupplier | null> => {
  const result = await Supplier.findByIdAndDelete(id);
  return result;
};

export const SupplierService = {
  createSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};