import express from "express";
import { SalesController } from "./sales.controller";

const router = express.Router();

// Create + Post sale (current requirement: posting on create)
router.post("/create-sale", SalesController.createSale);

// Update sale (admin can update posted sale; version increments internally)
router.patch("/:id", SalesController.updateSale);

// Invoice view (optionally: ?version=2)
router.get("/sale-invoice/:id", SalesController.getSaleInvoice);

// UI hydration / visualization data
router.get("/sale-ui/:id", SalesController.getSaleUi);

// For patch
router.get("/sale-update/:id", SalesController.getSaleForPatch);
// Get all will be added later
router.get("/", SalesController.getAllSales);

export const SalesRoutes_V2 = router;
