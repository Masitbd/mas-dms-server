import express from 'express';
import { MedicineController } from './medicines.controller';

const router = express.Router();

router.post('/create-medicine', MedicineController.createMedicine);
router.get('/', MedicineController.getAllMedicines);
router.get('/:id', MedicineController.getSingleMedicine);
router.patch('/:id', MedicineController.updateMedicine);
router.delete('/:id', MedicineController.deleteMedicine);

export const MedicineRoutes = router;
