

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
