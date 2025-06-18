import { Router } from "express";
import { CategoryRoutes } from "../modules/medicineCategory/mCategory.routes";
import { GenricRoutes } from "../modules/mGeneric/generic.routes";

const router = Router();

const modules = [
  { path: "/category", module: CategoryRoutes },
  { path: "/generics", module: GenricRoutes },
  // { path: "/admission", module: AdmissionRoutes },
  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
