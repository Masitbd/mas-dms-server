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
import { SalesRoutes } from "../modules/sales/sales.routes";
import { PurchasePaymentsRoutes } from "../modules/purchasePayments/purchasePayments.routes";
import { OrdersRoutes } from "../modules/orders/orders.routes";
import { OrderItemsRoutes } from "../modules/orderItems/orderItems.routes";
import { PaymentsRoutes } from "../modules/payments/payments.routes";
import { PurchaseReturnsRoutes } from "../modules/purchaseReturns/purchaseReturns.routes";
import { PurchaseReturnItemsRoutes } from "../modules/purchaseReturnItems/purchaseReturnItems.routes";
import { SupplierCreditsRoutes } from "../modules/supplierCredits/supplierCredits.routes";
import { reportRoutes } from "../modules/reports/reports.routes";

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
  { path: "/sales", module: SalesRoutes },
  { path: "/purchase-payments", module: PurchasePaymentsRoutes },
  { path: "/orders", module: OrdersRoutes },
  { path: "/order-items", module: OrderItemsRoutes },
  { path: "/payments", module: PaymentsRoutes },
  { path: "/purchase-returns", module: PurchaseReturnsRoutes },
  { path: "/purchase-return-items", module: PurchaseReturnItemsRoutes },
  { path: "/supplier-credits", module: SupplierCreditsRoutes },
  { path: "/reports", module: reportRoutes },

  // { path: "/payments", module: PaymentRoutes },
];

modules.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
