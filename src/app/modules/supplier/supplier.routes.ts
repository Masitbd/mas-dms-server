import { Router } from "express";
import { supplierControllers } from "./supplier.controller";

const router = Router();

router.post("/", supplierControllers.createSupplier);

// ! export

export const SupplierRoutes = router;
