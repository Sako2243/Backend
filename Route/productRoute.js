import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  hardDeleteProduct
} from "../controllers/productController.js";

import { protect, isSuperAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();


// ======================
// PUBLIC ROUTES
// ======================
router.get("/", getProducts);
router.get("/:id", getProductById);


// ======================
// ADMIN ROUTES
// ======================
router.post(
  "/",
  protect,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  isSuperAdmin,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  isSuperAdmin,
  deleteProduct
);


// ======================
// SPECIAL ADMIN ACTIONS
// ======================
router.put(
  "/restore/:id",
  protect,
  isSuperAdmin,
  restoreProduct
);

router.delete(
  "/hard/:id",
  protect,
  isSuperAdmin,
  hardDeleteProduct
);


export default router;