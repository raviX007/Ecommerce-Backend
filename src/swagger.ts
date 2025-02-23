import { Application } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the E-Commerce platform",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: {
              type: "string",
              enum: ["admin", "customer"],
            },
            phoneNumber: { type: "string" },
            address: { type: "string" },
            isActive: { type: "boolean" },
            lastLoginAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", format: "float" },
            stock: { type: "number" },
            image: {
              type: "string",
              format: "binary",
              description: "Product image file",
            },
            categoryId: { type: "number" },
          },
        },
        ProductUpdate: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", format: "float" },
            stock: { type: "number" },
            image: {
              type: "string",
              format: "binary",
              description: "Product image file",
            },
            categoryId: { type: "number" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            description: { type: "string" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "number" },
            user: { $ref: "#/components/schemas/User" },
            product: { $ref: "#/components/schemas/Product" },
            quantity: { type: "number" },
            priceAtAdd: { type: "number", format: "float" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "number" },
            user: { $ref: "#/components/schemas/User" },
            totalAmount: { type: "number", format: "float" },
            status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "number" },
            order: { $ref: "#/components/schemas/Order" },
            product: { $ref: "#/components/schemas/Product" },
            quantity: { type: "number" },
            priceAtOrder: { type: "number", format: "float" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        },
        RegistrationRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: {
              type: "string",
              enum: ["admin", "customer"],
              default: "customer",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            errors: { type: "array", items: { type: "string" } },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        NotFound: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegistrationRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/BadRequest" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user details",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Current user details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/api/cart": {
        get: {
          tags: ["Cart"],
          summary: "Get user cart",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User cart items",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/CartItem" },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/api/cart/items": {
        post: {
          tags: ["Cart"],
          summary: "Add item to cart",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId", "quantity"],
                  properties: {
                    productId: { type: "number" },
                    quantity: { type: "number", minimum: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Item added to cart",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CartItem" },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },

      "/api/cart/items/{itemId}": {
        put: {
          tags: ["Cart"],
          summary: "Update cart item quantity",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quantity"],
                  properties: {
                    quantity: { type: "number", minimum: 1 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Cart item updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CartItem" },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Cart"],
          summary: "Remove item from cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            200: {
              description: "Item removed from cart",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
      },
      "/api/orders": {
        post: {
          tags: ["Orders"],
          summary: "Create a new order",
          security: [{ bearerAuth: [] }],
          responses: {
            201: {
              description: "Order created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
        get: {
          tags: ["Orders"],
          summary: "Get user orders",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List of orders",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/api/orders/{orderId}": {
        get: {
          tags: ["Orders"],
          summary: "Get order details",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            200: {
              description: "Order details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
      },
      "/api/orders/{orderId}/status": {
        put: {
          tags: ["Orders"],
          summary: "Update order status",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: [
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Order status updated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
      },
      "/api/orders/{orderId}/cancel": {
        post: {
          tags: ["Orders"],
          summary: "Cancel order",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            200: {
              description: "Order cancelled successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
      },

      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "List products with filters",
          security: [{ bearerAuth: [] }],
          description:
            "Get a paginated list of products with optional filters for price range, category, and search",
          parameters: [
            {
              name: "minPrice",
              in: "query",
              description: "Minimum price filter",
              schema: {
                type: "number",
                format: "float",
                minimum: 0,
              },
            },
            {
              name: "maxPrice",
              in: "query",
              description: "Maximum price filter",
              schema: {
                type: "number",
                format: "float",
                minimum: 0,
              },
            },
            {
              name: "categoryId",
              in: "query",
              description: "Filter products by category ID",
              schema: {
                type: "number",
              },
            },
            {
              name: "search",
              in: "query",
              description: "Search products by name",
              schema: {
                type: "string",
              },
            },
            {
              name: "page",
              in: "query",
              description: "Page number for pagination",
              schema: {
                type: "number",
                default: 1,
                minimum: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Number of items per page",
              schema: {
                type: "number",
                default: 10,
                minimum: 1,
                maximum: 100,
              },
            },
          ],
          responses: {
            200: {
              description: "List of products with pagination info",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductList",
                  },
                  example: {
                    products: [
                      {
                        id: 1,
                        name: "Smartphone X",
                        description: "Latest smartphone model",
                        price: 999.99,
                        stock: 50,
                        imageUrl: "https://example.com/image.jpg",
                        category: {
                          id: 1,
                          name: "Electronics",
                          description: "Electronic devices",
                        },
                      },
                    ],
                    total: 100,
                    page: 1,
                    totalPages: 10,
                  },
                },
              },
            },
            400: {
              description: "Bad Request - Invalid parameters",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Invalid price range",
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Error fetching products",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        post: {
          tags: ["Products"],
          summary: "Create a new product",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Product created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            400: { $ref: "#/components/responses/BadRequest" },
          },
        },
      },
      "/api/products/{id}": {
        put: {
          tags: ["Products"],
          summary: "Update a product",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  $ref: "#/components/schemas/ProductUpdate",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductUpdate",
                  },
                },
              },
            },
            "404": {
              description: "Product not found",
            },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete a product",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Product ID",
            },
          ],
          responses: {
            "200": {
              description: "Product deleted successfully",
            },
            "404": {
              description: "Product not found",
            },
          },
        },
      },

      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "Get all categories",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 10 },
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "List of categories",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Category" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "number" },
                          pages: { type: "number" },
                          page: { type: "number" },
                          limit: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Categories"],
          summary: "Create a new category",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Category created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Category" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            400: { $ref: "#/components/responses/BadRequest" },
          },
        },
      },
      "/api/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Get a category by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            200: {
              description: "Category details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Category" },
                    },
                  },
                },
              },
            },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Categories"],
          summary: "Update a category",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Category updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/Category" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Categories"],
          summary: "Delete a category",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "number" },
            },
          ],
          responses: {
            200: {
              description: "Category deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { $ref: "#/components/responses/Unauthorized" },
            404: { $ref: "#/components/responses/NotFound" },
            400: {
              description: "Cannot delete category with associated products",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  apis: [
    "./dist/controllers/*.js",
    "./src/controllers/*.ts",
    "./src/routes/*.ts",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: Application): void => {
  app.use("/api-docs", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      explorer: true,
      customSiteTitle: "Ecommerce site Documentation",
      swaggerOptions: {
        displayRequestDuration: true,
        persistAuthorization: true,
      },
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.json(swaggerDocs);
  });
};

export default setupSwagger;
