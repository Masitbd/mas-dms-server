import { TMCategoryAndGeneric } from "./mCategory.interface";
import { Category } from "./mCategory.model";

const createCategoryIntoDB = async (payload: TMCategoryAndGeneric) => {
  return Category.create(payload);
};

// ! export

export const categoryServices = {
  createCategoryIntoDB,
};
