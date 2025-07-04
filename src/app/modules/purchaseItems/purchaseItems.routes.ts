import express from "express";
import { PurchaseItemController } from "./purchaseItems.controller";

const router = express.Router();

router.post("/create-purchase-item", PurchaseItemController.createPurchaseItem);
router.get("/", PurchaseItemController.getAllPurchaseItems);
router.get("/:id", PurchaseItemController.getSinglePurchaseItem);
router.patch("/:id", PurchaseItemController.updatePurchaseItem);
router.delete("/:id", PurchaseItemController.deletePurchaseItem);

export const PurchaseItemRoutes = router;
