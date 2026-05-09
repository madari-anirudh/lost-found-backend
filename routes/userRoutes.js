const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  verifyEmailByLink,
  forgotPassword,
  verifyResetOtp,
  resetPassword
} = require("../controllers/userController");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/verify/:token", verifyEmailByLink);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;