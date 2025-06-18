import { Router } from "express";
import { MRoutes } from "../modules/medicineCategory/mCategory.routes";

const router = Router();

const modules = [
  { path: "/category", module: MRoutes },
  // { path: "/beds", module: BedRoutes },
  // { path: "/admission", module: AdmissionRoutes },
  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
