import { Router } from "express";
import {
  getDueCollectionStatement,
  getMedicineSalesStatement,
} from "./report.controller";

const router = Router();

router.get("/medicine-sales-statement", getMedicineSalesStatement);
router.get("/due-collection", getDueCollectionStatement);

export const reportRoutes = router;
