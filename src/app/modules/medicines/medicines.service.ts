import { IMedicine } from './medicines.interface';
import { Medicine } from './medicines.model';

const createMedicine = async (payload: IMedicine): Promise<IMedicine> => {
  const result = await Medicine.create(payload);
  return result;
};

const getAllMedicines = async (): Promise<IMedicine[]> => {
  const result = await Medicine.find({}).populate('genericName').populate('category');
  return result;
};

const getSingleMedicine = async (id: string): Promise<IMedicine | null> => {
  const result = await Medicine.findById(id).populate('genericName').populate('category');
  return result;
};

const updateMedicine = async (
  id: string,
  payload: Partial<IMedicine>
): Promise<IMedicine | null> => {
  const result = await Medicine.findOneAndUpdate({ _id: id }, payload, {
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
