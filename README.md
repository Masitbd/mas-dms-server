

# Express ts starter Pack





## 📂 Project Structure

```sh
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
```

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

### Supplier Module

*   **POST** `/api/v1/suppliers/create-supplier` - Create a new supplier
*   **GET** `/api/v1/suppliers` - Get all suppliers
*   **GET** `/api/v1/suppliers/:id` - Get a single supplier
*   **PATCH** `/api/v1/suppliers/:id` - Update a supplier
*   **DELETE** `/api/v1/suppliers/:id` - Delete a supplier

### Medicine Module

*   **POST** `/api/v1/medicines/create-medicine` - Create a new medicine
*   **GET** `/api/v1/medicines` - Get all medicines
*   **GET** `/api/v1/medicines/:id` - Get a single medicine
*   **PATCH** `/api/v1/medicines/:id` - Update a medicine
*   **DELETE** `/api/v1/medicines/:id` - Delete a medicine

### Purchase Module

*   **POST** `/api/v1/purchases/create-purchase` - Create a new purchase
*   **GET** `/api/v1/purchases` - Get all purchases
*   **GET** `/api/v1/purchases/:id` - Get a single purchase
*   **PATCH** `/api/v1/purchases/:id` - Update a purchase
*   **DELETE** `/api/v1/purchases/:id` - Delete a purchase

### Purchase Item Module

*   **POST** `/api/v1/purchase-items/create-purchase-item` - Create a new purchase item
*   **GET** `/api/v1/purchase-items` - Get all purchase items
*   **GET** `/api/v1/purchase-items/:id` - Get a single purchase item
*   **PATCH** `/api/v1/purchase-items/:id` - Update a purchase item
*   **DELETE** `/api/v1/purchase-items/:id` - Delete a purchase item

### Stock Module

*   **POST** `/api/v1/stock/create-stock` - Create a new stock
*   **GET** `/api/v1/stock` - Get all stock
*   **GET** `/api/v1/stock/:id` - Get a single stock
*   **PATCH** `/api/v1/stock/:id` - Update a stock
*   **DELETE** `/api/v1/stock/:id` - Delete a stock
