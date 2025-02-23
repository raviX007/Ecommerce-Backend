import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.post(
  "/",
  authenticateToken,
  orderController.createOrder.bind(orderController)
);

router.get(
  "/my-orders",
  authenticateToken,
  orderController.getUserOrders.bind(orderController)
);

router.get(
  "/:orderId",
  authenticateToken,
  orderController.getOrderDetails.bind(orderController)
);

router.put(
  "/:orderId/status",
  authenticateToken,
  isAdmin,
  orderController.updateOrderStatus.bind(orderController)
);

router.post(
  "/:orderId/cancel",
  authenticateToken,
  orderController.cancelOrder.bind(orderController)
);

router.get(
  "/",
  authenticateToken,
  isAdmin,
  orderController.getAllOrders.bind(orderController)
);

export default router;
