import { Router } from "express";
import {
  getDueCollectionStatement,
  getDueCollectionSummery,
  getMedicineSalesStatement,
  getMedicineStockRecord,
  getPatientDueSummery,
  getPatientSaleDueStatement,
} from "./report.controller";

const router = Router();

router.get("/medicine-sales-statement", getMedicineSalesStatement);
router.get("/due-collection", getDueCollectionStatement);
router.get("/due-collection-summery", getDueCollectionSummery);
router.get("/patient-due-list", getPatientSaleDueStatement);
router.get("/patient-due-summery", getPatientDueSummery);
router.get("/medicine-stock", getMedicineStockRecord);

export const reportRoutes = router;
