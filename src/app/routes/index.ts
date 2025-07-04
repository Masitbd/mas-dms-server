import { Router } from "express";
import { CategoryRoutes } from "../modules/medicineCategory/mCategory.routes";
import { GenricRoutes } from "../modules/mGeneric/generic.routes";
import { SupplierRoutes } from "../modules/supplier/supplier.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProfileRoutes } from "../modules/profile/profile.route";
import { MedicineRoutes } from "../modules/medicines/medicines.routes";
import { PurchaseRoutes } from "../modules/purchases/purchases.routes";
import { PurchaseItemRoutes } from "../modules/purchaseItems/purchaseItems.routes";
import { StockRoutes } from "../modules/stock/stock.routes";

const router = Router();

const modules = [
  { path: "/category", module: CategoryRoutes },
  { path: "/generics", module: GenricRoutes },
  { path: "/suppliers", module: SupplierRoutes },
  { path: "/auth", module: AuthRoutes },
  { path: "/user", module: UserRoutes },
  { path: "/profile", module: ProfileRoutes },
  { path: "/medicines", module: MedicineRoutes },
  { path: "/purchases", module: PurchaseRoutes },
  { path: "/purchase-items", module: PurchaseItemRoutes },
  { path: "/stock", module: StockRoutes },

  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
