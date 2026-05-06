const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto"); // ✅ ADD THIS

// =================Generate JWT ==============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ======================= REGISTER (WITH OTP + LINK) =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log("TOKEN GENERATED:", verifyToken);  //===========================================================
    // ✅ create verification link
    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;
    user.verifyToken = verifyToken;

    // ✅ create user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      verifyToken, // ✅ FIXED
      isVerified: false
    });
    console.log("USER SAVED TOKEN:", user.verifyToken);   //==================================================
    // ✅ send email (OTP + link)
    await sendEmail(email, otp, verifyUrl);

    res.status(201).json({
      message: "OTP sent to email",
      userId: user._id
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ======================= VERIFY OTP =======================
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.verifyToken = null; // ✅ clear token too

    await user.save();

    res.json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= VERIFY BY LINK =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log("TOKEN GENERATED:", verifyToken);

    // ✅ create verification link
    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;

    // ✅ create user (TOKEN SAVED HERE)
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      verifyToken,
      isVerified: false
    });

    console.log("USER SAVED TOKEN:", user.verifyToken);

    // ✅ send email (OTP + verify link)
    await sendEmail(email, otp, verifyUrl);

    res.status(201).json({
      message: "OTP sent to email",
      userId: user._id
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =========================Resend otp======================
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const verifyToken = require("crypto")
      .randomBytes(32)
      .toString("hex");

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.verifyToken = verifyToken;

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;

    await sendEmail(email, otp, verifyUrl);

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};