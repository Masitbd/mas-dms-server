import { SortOrder } from "mongoose";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IGenericResponse } from "../../interface/common";
import { IPaginationOptions } from "../../interface/pagination";
import { IMedicine } from './medicines.interface';
import { Medicine } from './medicines.model';
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

const getAllMedicines = async (
  query: Record<string, unknown>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMedicine[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const medicineSearchableFields = ["name", "medicineId", "unit", "salesRate"];

  const medicineQuery = new QueryBuilder(Medicine.find().populate('genericName').populate('category').populate('supplierName'), query)
    .search(medicineSearchableFields)
    .filter()
    .sort(sortBy, sortOrder as SortOrder)
    .paginate(page, limit, skip)
    .fields();

  const result = await medicineQuery.modelQuery;
  const meta = {
    page,
    limit,
    total: await Medicine.countDocuments(),
  };

  return {
    meta,
    data: result,
  };
};

const getSingleMedicine = async (id: string): Promise<IMedicine | null> => {
  const result = await Medicine.findById(id).populate('genericName').populate('category').populate('supplierName');
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
  getAllMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
