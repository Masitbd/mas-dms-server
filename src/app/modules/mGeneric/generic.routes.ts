import { Router } from "express";
import { genericControllers } from "./generic.controller";
import validateRequest from "../../middleware/validateRequest";
import { GenericValidation } from "./generic.validation";

const router = Router();

router.post(
  "/",
  validateRequest(GenericValidation.createGenericZodSchema),
  genericControllers.createGeneric
);
router.get("/", genericControllers.getAllGenerics);
router.get("/:id", genericControllers.getSingleGeneric);
router.patch(
  "/:id",
  validateRequest(GenericValidation.updateGenericZodSchema),
  genericControllers.updateGeneric
);
router.delete("/:id", genericControllers.deleteGeneric);

export const GenricRoutes = router;
