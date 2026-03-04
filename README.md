# Express ts starter Pack

## 📂 Project Structure

````sh
src/
├── app/                 # Core application logic
│   ├── config/          # Configuration files
│   │   ├── error/       # Error handling utilities
│   │   ├── interface/   # TypeScript interfaces
│   │   ├── middleware/  # Express middlewares
│   │   ├── helpers/     # Helper functions
│   │   ├── builder/     # Utility functions
│   │   ├── routes/      # Global route handlers
│   ├── modules/         # Application modules (e.g., order, product)
│   │   ├── order/       # Order module
│   │   │   ├── order.controller.ts  # Controller for order-related routes
│   │   │   ├── order.model.ts       # Mongoose model for orders
│   │   │   ├── order.routes.ts      # Routes for order-related endpoints
│   │   │   ├── order.service.ts     # Service layer for order logic
│   │   ├── product/     # Product module
│   │   │   ├── product.controller.ts  # Controller for product-related routes
│   │   │   ├── product.model.ts       # Mongoose model for products
│   │   │   ├── product.routes.ts      # Routes for product-related endpoints
│   │   │   ├── product.service.ts     # Service layer for product logic
├── app.ts              # Main application entry point
├── utils/              # Reusable utility files
└── server.ts           # Server initialization

.env                    # Environment variables


## Run Locally

Clone the project

```bash
  git clone https://github.com/jubairJnu/express-ts-starter.git
````

Go to the project directory

```bash
  cd express-ts-starter
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```

## API Documentation

### Medicine Category Module

- **POST** `/api/v1/category` - Create a new medicine category
- **GET** `/api/v1/category` - Get all medicine categories (with search and pagination)
- **GET** `/api/v1/category/:id` - Get a single medicine category
- **PATCH** `/api/v1/category/:id` - Update a medicine category
- **DELETE** `/api/v1/category/:id` - Delete a medicine category

### Generic Module

- **POST** `/api/v1/generics` - Create a new generic medicine
- **GET** `/api/v1/generics` - Get all generic medicines (with search and pagination)
- **GET** `/api/v1/generics/:id` - Get a single generic medicine
- **PATCH** `/api/v1/generics/:id` - Update a generic medicine
- **DELETE** `/api/v1/generics/:id` - Delete a generic medicine

### Supplier Module

- **POST** `/api/v1/suppliers/create-supplier` - Create a new supplier
- **GET** `/api/v1/suppliers` - Get all suppliers (with search and pagination)
- **GET** `/api/v1/suppliers/:id` - Get a single supplier
- **PATCH** `/api/v1/suppliers/:id` - Update a supplier
- **DELETE** `/api/v1/suppliers/:id` - Delete a supplier

### Medicine Module

- **POST** `/api/v1/medicines/create-medicine` - Create a new medicine
- **GET** `/api/v1/medicines` - Get all medicines (with search and pagination)
- **GET** `/api/v1/medicines/:id` - Get a single medicine
- **PATCH** `/api/v1/medicines/:id` - Update a medicine
- **DELETE** `/api/v1/medicines/:id` - Delete a medicine

### Purchase Module

- **POST** `/api/v1/purchases/create-purchase` - Create a new purchase
- **GET** `/api/v1/purchases` - Get all purchases
- **GET** `/api/v1/purchases/:id` - Get a single purchase
- **PATCH** `/api/v1/purchases/:id` - Update a purchase
- **DELETE** `/api/v1/purchases/:id` - Delete a purchase

### Purchase Item Module

- **POST** `/api/v1/purchase-items/create-purchase-item` - Create a new purchase item
- **GET** `/api/v1/purchase-items` - Get all purchase items
- **GET** `/api/v1/purchase-items/:id` - Get a single purchase item
- **PATCH** `/api/v1/purchase-items/:id` - Update a purchase item
- **DELETE** `/api/v1/purchase-items/:id` - Delete a purchase item
- **GET FOR SINGLE PURCHASE** `/api/v1/purchase-items/single-purchase/:id` -Will fetch all data related to a purchase

### Stock Module

- **POST** `/api/v1/stock/create-stock` - Create a new stock
- **GET** `/api/v1/stock` - Get all stock
- **GET** `/api/v1/stock/:id` - Get a single stock
- **PATCH** `/api/v1/stock/:id` - Update a stock
- **DELETE** `/api/v1/stock/:id` - Delete a stock

### Sales Module

- **POST** `/api/v1/sales/create-sale` - Create a new sale
- **GET** `/api/v1/sales` - Get all sales
- **GET** `/api/v1/sales/:id` - Get a single sale
- **PATCH** `/api/v1/sales/:id` - Update a sale
- **DELETE** `/api/v1/sales/:id` - Delete a sale

### Purchase Payments Module

- **POST** `/api/v1/purchase-payments/create-payment` - Create a new purchase payment
- **GET** `/api/v1/purchase-payments` - Get all purchase payments
- **GET** `/api/v1/purchase-payments/:id` - Get a single purchase payment
- **PATCH** `/api/v1/purchase-payments/:id` - Update a purchase payment
- **DELETE** `/api/v1/purchase-payments/:id` - Delete a purchase payment

### Orders Module

- **POST** `/api/v1/orders/create-order` - Create a new order
- **GET** `/api/v1/orders` - Get all orders
- **GET** `/api/v1/orders/:id` - Get a single order
- **PATCH** `/api/v1/orders/:id` - Update an order
- **DELETE** `/api/v1/orders/:id` - Delete an order

### Order Items Module

- **POST** `/api/v1/order-items/create-order-item` - Create a new order item
- **GET** `/api/v1/order-items` - Get all order items
- **GET** `/api/v1/order-items/:id` - Get a single order item
- **PATCH** `/api/v1/order-items/:id` - Update an order item
- **DELETE** `/api/v1/order-items/:id` - Delete an order item

### Payments Module

- **POST** `/api/v1/payments/create-payment` - Create a new payment
- **GET** `/api/v1/payments` - Get all payments
- **GET** `/api/v1/payments/:id` - Get a single payment
- **PATCH** `/api/v1/payments/:id` - Update a payment
- **DELETE** `/api/v1/payments/:id` - Delete a payment

### Purchase Returns Module

- **POST** `/api/v1/purchase-returns/create-return` - Create a new purchase return
- **GET** `/api/v1/purchase-returns` - Get all purchase returns
- **GET** `/api/v1/purchase-returns/:id` - Get a single purchase return
- **PATCH** `/api/v1/purchase-returns/:id` - Update a purchase return
- **DELETE** `/api/v1/purchase-returns/:id` - Delete a purchase return

### Purchase Return Items Module

- **POST** `/api/v1/purchase-return-items/create-return-item` - Create a new purchase return item
- **GET** `/api/v1/purchase-return-items` - Get all purchase return items
- **GET** `/api/v1/purchase-return-items/:id` - Get a single purchase return item
- **PATCH** `/api/v1/purchase-return-items/:id` - Update a purchase return item
- **DELETE** `/api/v1/purchase-return-items/:id` - Delete a purchase return item

### Supplier Credits Module

- **POST** `/api/v1/supplier-credits/create-credit` - Create a new supplier credit
- **GET** `/api/v1/supplier-credits` - Get all supplier credits
- **GET** `/api/v1/supplier-credits/:id` - Get a single supplier credit
- **PATCH** `/api/v1/supplier-credits/:id` - Update a supplier credit
- **DELETE** `/api/v1/supplier-credits/:id` - Delete a supplier credit

### Reports Module

- **GET** `/api/v1/reports/medicine-sales-statement` - Get medicine sales statement report
- **GET** `/api/v1/reports/due-collection` - Get due collection statement report
- **GET** `/api/v1/reports/due-collection-summery` - Get due collection summary report
- **GET** `/api/v1/reports/patient-due-list` - Get patient due list report
- **GET** `/api/v1/reports/patient-due-summery` - Get patient due summary report
- **GET** `/api/v1/reports/medicine-stock` - Get medicine stock report
- **GET** `/api/v1/reports/medicine-stock-statement` - Get medicine stock statement report
- **GET** `/api/v1/reports/medicine-profit-loss` - Get medicine profit and loss report
- **GET** `/api/v1/reports/medicine-expiry-statement` - Get medicine expiry statement report
- **GET** `/api/v1/reports/medicine-income-statement-summary` - Get medicine income statement summary report
- `medicine-stock-statement` response fields: `records[]` (`mCategory`, `medicineName`, `stockQty`, `purchaseQty`, `totalPValue`, `unitPrice`, `totalSValue`), `totals` (`totalStockQty`, `totalPurchaseQty`, `totalPurchaseValue`, `totalStockValue`)
- `medicine-profit-loss` query params: `startDate` (optional, example: `2025-10-01`), `endDate` (optional, example: `2025-10-31`)
- `medicine-profit-loss` response fields: `records[]` (`particulars`, `qty`, `salesRate`, `totalAmount`, `purchaseRate`, `discount`, `netAmount`, `totalPRate`, `netProfit`), `totals` (same summary fields)
- `medicine-expiry-statement` query params: `startDate` (optional, example: `2025-10-01`), `endDate` (optional, example: `2025-10-31`)
- `medicine-expiry-statement` response fields: `records[]` (`invoiceNo`, `supplierName`, `category`, `medicineName`, `batchNo`, `qty`, `rate`, `amount`, `dateMfg`, `dateExp`), `totalQty`, `grandTotalAmount`
- `medicine-income-statement-summary` query params: `startDate` (optional, example: `2025-10-01`), `endDate` (optional, example: `2025-10-31`)
- `medicine-income-statement-summary` response fields: `records[]` and `total` with `indoor`, `outdoor`, `totalDiscount`, `indoorReturn`, `outdoorReturn`, `dueCollection`, `totalAdvance`, `netCollection`, `totalDue`
