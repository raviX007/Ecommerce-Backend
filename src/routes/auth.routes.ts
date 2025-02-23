import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validation.middleware";

const router = Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
