import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  restoreCategory,
  hardDeleteCategory
} from "../controllers/categoryController.js";

import { protect, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ======================
   PUBLIC
====================== */
router.get("/all", getCategories);

/* ======================
   ADMIN (SUPER ADMIN ONLY)
====================== */
router.post("/add", protect, isSuperAdmin, createCategory);

router.put("/update/:id", protect, isSuperAdmin, updateCategory);

router.delete("/delete/:id", protect, isSuperAdmin, deleteCategory);

router.put("/restore/:id", protect, isSuperAdmin, restoreCategory);
router.delete(
  "/hard-delete/:id",
  protect,
  isSuperAdmin,
  hardDeleteCategory
);

export default router;