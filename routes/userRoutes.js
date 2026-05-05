const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  verifyEmailByLink
} = require("../controllers/userController");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/verify/:token", verifyEmailByLink);

module.exports = router;