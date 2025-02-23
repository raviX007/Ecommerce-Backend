# E-Commerce API

A robust e-commerce REST API built with Node.js, Express, TypeScript, and TypeORM.

## Features

- 🔐 Authentication & Authorization
- 🛍️ Product Management
- 🛒 Shopping Cart
- 📦 Order Processing
- 📑 Category Management
- 📝 Swagger Documentation
- 🔒 JWT Token Authentication
- 🖼️ Image Upload Support
- 🎯 Input Validation
- 🔄 Rate Limiting

## Tech Stack

- Node.js
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- JWT
- Swagger/OpenAPI
- Multer
- Cloudinary

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
https://github.com/raviX007/Ecommerce-Backend.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the following commmands to start development server:

```bash
npx tsc

node dist/server.js
```

5.Run with Docker:

Give your desired name for the app and generate docker images using the command

```bash
docker build -t my-express-app .
```

Then Retrive Image Id or Name:

```bash
docker images
```

Run your docker app using following commands:

```bash
docker run -p 3000:3000 --env-file .env my-express-app
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - List all products
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart/items` - Add item to cart
- PUT `/api/cart/items/:id` - Update cart item
- DELETE `/api/cart/items/:id` - Remove cart item

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user's orders
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/status` - Update order status (Admin)

### Categories
- GET `/api/categories` - List categories
- POST `/api/categories` - Create category (Admin)
- PUT `/api/categories/:id` - Update category (Admin)
- DELETE `/api/categories/:id` - Delete category (Admin)
