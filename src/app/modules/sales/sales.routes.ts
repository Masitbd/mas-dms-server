import { SalesController } from "./sales.controller";
import express from "express";

const router = express.Router();

router.post("/", SalesController.createSale);
router.get("/", SalesController.getAllSales);
router.get("/:id", SalesController.getSingleSale);
router.patch("/:id", SalesController.updateSale);
router.delete("/:id", SalesController.deleteSale);

export const SalesRoutes = router;
