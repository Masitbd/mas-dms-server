import { Request, Response } from "express";
import { SalesController } from "./sales.controller";
import express from "express";

const router = express.Router();

router.post("/create-sale", SalesController.createSale);
router.get("/", SalesController.getAllSales);
router.get("/:id", SalesController.getSingleSale);
router.patch("/:id", SalesController.updateSale);
router.delete("/:id", SalesController.deleteSale);

export const SalesRoutes = router;
