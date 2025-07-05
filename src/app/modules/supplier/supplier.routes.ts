import express from 'express';
import { SupplierController } from './supplier.controller';
import validateRequest from "../../middleware/validateRequest";
import { SupplierValidation } from "./supplier.validation";

const router = express.Router();

router.post(
  '/create-supplier',
  validateRequest(SupplierValidation.createSupplierZodSchema),
  SupplierController.createSupplier
);
router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierController.getSingleSupplier);
router.patch(
  '/:id',
  validateRequest(SupplierValidation.updateSupplierZodSchema),
  SupplierController.updateSupplier
);
router.delete('/:id', SupplierController.deleteSupplier);

export const SupplierRoutes = router;