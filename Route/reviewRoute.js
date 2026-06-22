import express from "express";
import {
  uploadReview,
  getReviews,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect, isSuperAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* =========================
   GET ALL REVIEWS
========================= */
router.get("/getAllReviews", getReviews);

/* =========================
   CREATE REVIEW
========================= */
router.post(
  "/createReview",
  protect,
  isSuperAdmin,
  upload.single("image"),
  uploadReview
);

/* =========================
   DELETE REVIEW
========================= */
router.delete(
  "/deleteReview/:id",
  protect,
  isSuperAdmin,
  deleteReview
);

export default router;