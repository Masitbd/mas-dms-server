import { Request, Response } from "express";
import { PaymentController } from "./payments.controller";
import express from "express";

const router = express.Router();

router.post("/create-payment", PaymentController.createPayment);
router.get("/", PaymentController.getAllPayments);
router.get("/:id", PaymentController.getSinglePayment);
router.patch("/:id", PaymentController.updatePayment);
router.delete("/:id", PaymentController.deletePayment);

export const PaymentsRoutes = router;
