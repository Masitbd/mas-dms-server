import { Router } from "express";
import { categoryControllers } from "./mCategory.controller";
import validateRequest from "../../middleware/validateRequest";
import { CategoryValidation } from "./mCategory.validation";

const router = Router();

router.post(
  "/",
  validateRequest(CategoryValidation.createCategoryZodSchema),
  categoryControllers.createCategory
);
router.get("/", categoryControllers.getAllCategories);
router.get("/:id", categoryControllers.getSingleCategory);
router.patch(
  "/:id",
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  categoryControllers.updateCategory
);
router.delete("/:id", categoryControllers.deleteCategory);

export const CategoryRoutes = router;
