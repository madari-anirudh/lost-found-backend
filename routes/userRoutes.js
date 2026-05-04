const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOtp,
  verifyEmailByLink
} = require("../controllers/userController");

// REGISTER (send OTP)
router.post("/register", registerUser);

// LOGIN (only verified users)
router.post("/login", loginUser);

// VERIFY OTP
router.post("/verify-otp", verifyOtp); 

// VERIFICATION LINK
router.get("/verify/:token", verifyEmailByLink);

module.exports = router;