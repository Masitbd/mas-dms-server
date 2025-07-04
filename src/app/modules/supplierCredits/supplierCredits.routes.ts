import { Request, Response } from "express";
import express from "express";
import { SupplierCreditController } from "./supplierCredits.controller";

const router = express.Router();

router.post("/create-credit", SupplierCreditController.createSupplierCredit);
router.get("/", SupplierCreditController.getAllSupplierCredits);
router.get("/:id", SupplierCreditController.getSingleSupplierCredit);
router.patch("/:id", SupplierCreditController.updateSupplierCredit);
router.delete("/:id", SupplierCreditController.deleteSupplierCredit);

export const SupplierCreditsRoutes = router;
