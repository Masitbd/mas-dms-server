import { Request, Response } from "express";
import { PurchaseReturnController } from "./purchaseReturns.controller";
import express from "express";

const router = express.Router();

router.post("/create-return", PurchaseReturnController.createPurchaseReturn);
router.get("/", PurchaseReturnController.getAllPurchaseReturns);
router.get("/:id", PurchaseReturnController.getSinglePurchaseReturn);
router.patch("/:id", PurchaseReturnController.updatePurchaseReturn);
router.delete("/:id", PurchaseReturnController.deletePurchaseReturn);

export const PurchaseReturnsRoutes = router;
