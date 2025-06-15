import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const modules = [
  { path: "/users", module: UserRoutes },
  // { path: "/beds", module: BedRoutes },
  // { path: "/admission", module: AdmissionRoutes },
  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
