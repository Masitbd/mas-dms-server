import express from "express";
import { PurchaseController } from "./purchases.controller";

const router = express.Router();

router.post("/create-purchase", PurchaseController.createPurchase);
router.get("/", PurchaseController.getAllPurchases);
router.get("/:id", PurchaseController.getSinglePurchase);
router.patch("/:id", PurchaseController.updatePurchase);
router.delete("/:id", PurchaseController.deletePurchase);
router.get("/purchase-invoice/:id", PurchaseController.getPurchaseInvoice);
export const PurchaseRoutes = router;
