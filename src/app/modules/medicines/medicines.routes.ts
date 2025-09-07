import express from "express";
import { MedicineController } from "./medicines.controller";
import validateRequest from "../../middleware/validateRequest";
import { MedicineValidation } from "./medicines.validation";

const router = express.Router();

router.get("/", MedicineController.getAllMedicines);
router.get("/with-stock", MedicineController.getAllMedicinesWithStock);
router.post(
  "/create-medicine",
  validateRequest(MedicineValidation.createMedicineZodSchema),
  MedicineController.createMedicine
);
router.get("/:id", MedicineController.getSingleMedicine);
router.patch(
  "/:id",
  validateRequest(MedicineValidation.updateMedicineZodSchema),
  MedicineController.updateMedicine
);
router.delete("/:id", MedicineController.deleteMedicine);

export const MedicineRoutes = router;
