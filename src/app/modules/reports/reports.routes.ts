import { Router } from "express";
import {
  getDueCollectionStatement,
  getDueCollectionSummery,
  getMedicineExpiryStatement,
  getMedicineIncomeStatementSummary,
  getMedicineProfitLoss,
  getMedicineSalesStatement,
  getMedicineStockRecord,
  getMedicineStockStatement,
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
router.get("/medicine-stock-statement", getMedicineStockStatement);
router.get("/medicine-profit-loss", getMedicineProfitLoss);
router.get("/medicine-expiry-statement", getMedicineExpiryStatement);
router.get(
  "/medicine-income-statement-summary",
  getMedicineIncomeStatementSummary
);

export const reportRoutes = router;
