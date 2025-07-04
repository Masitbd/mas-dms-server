import { Request, Response } from "express";
import express from "express";
import { PurchaseReturnItemController } from "./purchaseReturnItems.controller";

const router = express.Router();

router.post(
  "/create-return-item",
  PurchaseReturnItemController.createPurchaseReturnItem
);
router.get("/", PurchaseReturnItemController.getAllPurchaseReturnItems);
router.get("/:id", PurchaseReturnItemController.getSinglePurchaseReturnItem);
router.patch("/:id", PurchaseReturnItemController.updatePurchaseReturnItem);
router.delete("/:id", PurchaseReturnItemController.deletePurchaseReturnItem);

export const PurchaseReturnItemsRoutes = router;
