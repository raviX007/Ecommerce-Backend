import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";
import multer from "multer";

const router = Router();
const productController = new ProductController();

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      req.fileValidationError = "Only image files are allowed!";
    }
  },
});

router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  productController.create.bind(productController)
);

router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  productController.update.bind(productController)
);

router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  productController.delete.bind(productController)
);

router.get("/", productController.getProducts.bind(productController));

export default router;
