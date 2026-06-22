import Admin from "../models/admin.js";
import { generateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";


// =========================
// LOGIN → JWT
// =========================
export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email.toLowerCase(),
    isActive: true,
  }).select("+password");

  if (!admin) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = generateToken({
    id: admin._id,
    role: admin.role,
  });

  res.json({
    message: "Login successful",
    token,
  });
});


// =========================
// CHANGE PASSWORD (CURRENT → NEW → CONFIRM)
// =========================
export const changePassword = asyncHandler(async (req, res) => {

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  const admin = await Admin.findById(req.user.id).select("+password");

  if (!admin) {
    return res.status(404).json({
      message: "Admin not found",
    });
  }

  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      message: "Current password is incorrect",
    });
  }

  admin.password = newPassword;
  await admin.save();

  res.json({
    message: "Password updated successfully",
  });
});


// =========================
// UPDATE EMAIL ONLY
// =========================
export const updateEmail = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newEmail,
    confirmEmail
  } = req.body;

  // 1. validation
  if (!currentPassword || !newEmail || !confirmEmail) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // 2. confirm match
  if (newEmail !== confirmEmail) {
    return res.status(400).json({
      message: "Emails do not match",
    });
  }

  // 3. get admin with password
  const admin = await Admin.findById(req.user.id).select("+password");

  if (!admin) {
    return res.status(404).json({
      message: "Admin not found",
    });
  }

  // 4. verify password
  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  // 5. check duplicate email
  const existing = await Admin.findOne({
    email: newEmail.toLowerCase(),
  });

  if (existing) {
    return res.status(400).json({
      message: "Email already in use",
    });
  }

  // 6. update email
  admin.email = newEmail.toLowerCase();

  await admin.save();

  res.json({
    message: "Email updated successfully",
    email: admin.email,
  });
});
// =========================
// LOGOUT
// =========================
export const logout = asyncHandler(async (req, res) => {

  res.json({
    message: "Logout successfully",
  });
});