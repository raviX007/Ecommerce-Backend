import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const cartController = new CartController();

router.post(
  "/items",
  authenticateToken,
  cartController.addItem.bind(cartController)
);

router.put(
  "/items/:itemId",
  authenticateToken,
  cartController.updateItemQuantity.bind(cartController)
);

router.delete(
  "/items/:itemId",
  authenticateToken,
  cartController.removeItem.bind(cartController)
);

router.get("/", authenticateToken, cartController.getCart.bind(cartController));

router.delete(
  "/",
  authenticateToken,
  cartController.clearCart.bind(cartController)
);

export default router;
