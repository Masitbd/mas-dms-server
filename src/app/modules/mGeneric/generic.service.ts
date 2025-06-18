import { TMCategoryAndGeneric } from "../medicineCategory/mCategory.interface";
import { Generic } from "./generic.model";

const createGenericIntoDB = async (payload: TMCategoryAndGeneric) => {
  return Generic.create(payload);
};

// ! export

export const genericServices = {
  createGenericIntoDB,
};
