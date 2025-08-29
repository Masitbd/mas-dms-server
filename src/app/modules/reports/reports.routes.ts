import { Router } from "express";
import {
  getDueCollectionStatement,
  getDueCollectionSummery,
  getMedicineSalesStatement,
} from "./report.controller";

const router = Router();

router.get("/medicine-sales-statement", getMedicineSalesStatement);
router.get("/due-collection", getDueCollectionStatement);
router.get("/due-collection-summery", getDueCollectionSummery);

export const reportRoutes = router;
