import { Request, Response } from "express";
import express from "express";
import { OrderController } from "./orders.controller";

const router = express.Router();

router.post("/create-order", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getSingleOrder);
router.patch("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

export const OrdersRoutes = router;
