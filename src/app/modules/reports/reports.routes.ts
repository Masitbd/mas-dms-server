import { Router } from "express";
import { getMedicineSalesStatement } from "./report.controller";

const router = Router();

router.get("/medicine-sales-statement", getMedicineSalesStatement);

export const reportRoutes = router;
