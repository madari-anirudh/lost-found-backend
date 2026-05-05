const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOtp,
  resendotp,
  verifyEmailByLink
} = require("../controllers/userController");

// REGISTER (send OTP)
router.post("/register", registerUser);

// LOGIN (only verified users)
router.post("/login", loginUser);

// VERIFY OTP
router.post("/verify-otp", verifyOtp); 

//resend Otp
router.post("/resend-otp",resendOtp);

// VERIFICATION LINK
router.get("/verify/:token", verifyEmailByLink);

module.exports = router;
