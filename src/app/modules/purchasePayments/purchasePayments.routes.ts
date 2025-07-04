import { Request, Response } from "express";
import { PurchasePaymentController } from "./purchasePayments.controller";
import express from "express";
const router = express.Router();

router.post("/create-payment", PurchasePaymentController.createPurchasePayment);
router.get("/", PurchasePaymentController.getAllPurchasePayments);
router.get("/:id", PurchasePaymentController.getSinglePurchasePayment);
router.patch("/:id", PurchasePaymentController.updatePurchasePayment);
router.delete("/:id", PurchasePaymentController.deletePurchasePayment);

export const PurchasePaymentsRoutes = router;
