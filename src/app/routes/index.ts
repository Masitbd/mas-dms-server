import { Router } from "express";
import { CategoryRoutes } from "../modules/medicineCategory/mCategory.routes";
import { GenricRoutes } from "../modules/mGeneric/generic.routes";
import { SupplierRoutes } from "../modules/supplier/supplier.routes";

const router = Router();

const modules = [
  { path: "/category", module: CategoryRoutes },
  { path: "/generics", module: GenricRoutes },
  { path: "/suppliers", module: SupplierRoutes },
  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
