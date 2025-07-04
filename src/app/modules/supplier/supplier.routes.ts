import express from 'express';
import { SupplierController } from './supplier.controller';

const router = express.Router();

router.post('/create-supplier', SupplierController.createSupplier);
router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierController.getSingleSupplier);
router.patch('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export const SupplierRoutes = router;