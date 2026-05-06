const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  loginUser,
  verifyEmailByLink,
  resendOtp   // ✅ MUST EXIST
} = require("../controllers/userController");

console.log("resendOtp:", resendOtp);
// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/verify/:token", verifyEmailByLink);

module.exports = router;