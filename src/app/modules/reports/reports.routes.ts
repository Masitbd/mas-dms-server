import { Router } from "express";
import {
  getDueCollectionStatement,
  getDueCollectionSummery,
  getMedicineSalesStatement,
  getPatientSaleDueStatement,
} from "./report.controller";

const router = Router();

router.get("/medicine-sales-statement", getMedicineSalesStatement);
router.get("/due-collection", getDueCollectionStatement);
router.get("/due-collection-summery", getDueCollectionSummery);
router.get("/patient-due-list", getPatientSaleDueStatement);

export const reportRoutes = router;
