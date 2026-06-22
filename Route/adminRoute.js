import express from "express";
import {
  login,
  changePassword,
  updateEmail,
  logout,
} from "../controllers/adminController.js";

import {
  protect,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();


// ======================
// AUTH (PUBLIC)
// ======================
router.post("/auth/login", login);


// ======================
// ACCOUNT (PROTECTED)
// ======================
router.put("/account/email", protect, updateEmail);

router.put("/account/password", protect, changePassword);

router.post("/auth/logout", protect, logout);


// ======================
// SUPER ADMIN ONLY (OPTIONAL)
// ======================
router.delete(
  "/:id",
  protect,
  authorize("super_admin"),
  (req, res) => {
    res.json({
      message: "Admin removed",
    });
  }
);

export default router;