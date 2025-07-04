import { Request, Response } from "express";
import express from "express";
import { OrderItemController } from "./orderItems.controller";

const router = express.Router();

router.post("/create-order-item", OrderItemController.createOrderItem);
router.get("/", OrderItemController.getAllOrderItems);
router.get("/:id", OrderItemController.getSingleOrderItem);
router.patch("/:id", OrderItemController.updateOrderItem);
router.delete("/:id", OrderItemController.deleteOrderItem);

export const OrderItemsRoutes = router;
