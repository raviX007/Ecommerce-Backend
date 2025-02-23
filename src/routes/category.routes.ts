import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
const categoryController = new CategoryController();

router.get("/", categoryController.getAll.bind(categoryController));
router.get("/:id", categoryController.getOne.bind(categoryController));

router.post(
  "/",
  authenticateToken,
  categoryController.create.bind(categoryController)
);
router.put(
  "/:id",
  authenticateToken,
  categoryController.update.bind(categoryController)
);
router.delete(
  "/:id",
  authenticateToken,
  categoryController.delete.bind(categoryController)
);

export default router;
