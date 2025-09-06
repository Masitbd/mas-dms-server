import { Router } from "express";
import {
  getDueCollectionStatement,
  getDueCollectionSummery,
  getMedicineProfitLoss,
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
router.get("/medicine-profit-loss", getMedicineProfitLoss);

export const reportRoutes = router;
