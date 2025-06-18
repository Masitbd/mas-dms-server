import { TMCategoryAndGeneric } from "./mCategory.interface";
import { MCATEGORY } from "./mCategory.model";

const createMCategoryIntoDB = async (payload: TMCategoryAndGeneric) => {
  return MCATEGORY.create(payload);
};

