import mongoose from "mongoose";
import Admin from "../models/admin.js";
import { generateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";


// =========================
// LOGIN → JWT
// =========================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }


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

    admin.incLoginAttempts();

    await admin.save();

    return res.status(401).json({
      message: "Invalid email or password",
    });

  }


  admin.resetLoginAttempts();

  await admin.save();


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
// CHANGE PASSWORD
// =========================

export const changePassword = asyncHandler(async (req, res) => {


  const {
    currentPassword,
    newPassword,
    confirmPassword
  } = req.body;



  if (newPassword !== confirmPassword) {

    return res.status(400).json({
      message: "Passwords do not match",
    });

  }



  const admin = await Admin
    .findById(req.user.id)
    .select("+password");



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
// UPDATE EMAIL
// =========================

export const updateEmail = asyncHandler(async (req, res) => {


  const {
    currentPassword,
    newEmail,
    confirmEmail
  } = req.body;



  if (!currentPassword || !newEmail || !confirmEmail) {

    return res.status(400).json({
      message: "All fields are required",
    });

  }



  if (newEmail !== confirmEmail) {

    return res.status(400).json({
      message: "Emails do not match",
    });

  }



  const admin = await Admin
    .findById(req.user.id)
    .select("+password");



  if (!admin) {

    return res.status(404).json({
      message: "Admin not found",
    });

  }



  const isMatch = await admin.comparePassword(currentPassword);



  if (!isMatch) {

    return res.status(400).json({
      message: "Incorrect password",
    });

  }



  const existing = await Admin.findOne({
    email: newEmail.toLowerCase(),
  });



  if (existing) {

    return res.status(400).json({
      message: "Email already in use",
    });

  }



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