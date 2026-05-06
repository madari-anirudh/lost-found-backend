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

    // ✅ create verification link
    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;

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
exports.verifyEmailByLink = async (req, res) => {
  try {
    const user = await User.findOne({ verifyToken: req.params.token });

    if (!user) {
      return res.status(400).send("Invalid or expired link");
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.send("Email verified successfully ✅");

  } catch (err) {
    res.status(500).send(err.message);
  }
};

// ======================= LOGIN =======================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ❗ BLOCK if not verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first"
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify/${user.verifyToken}`;

    const sendEmail = require("../utils/sendEmail");
    await sendEmail(user.email, otp, verifyUrl);

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
