// src/modules/customer/customer.route.ts
import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { customerControllers } from "./customer.controller";
import { CustomerValidation } from "./customer.validator";

const router = Router();

router.post(
  "/",
  validateRequest(CustomerValidation.createCustomerZodSchema),
  customerControllers.createCustomer
);

router.get("/", customerControllers.getAllCustomers);

// using uuid as identifier (matches your controller/service)
router.get("/:uuid", customerControllers.getSingleCustomer);

router.patch(
  "/:uuid",
  validateRequest(CustomerValidation.updateCustomerZodSchema),
  customerControllers.updateCustomer
);

router.delete("/:uuid", customerControllers.deleteCustomer);

export const CustomerRoutes = router;
