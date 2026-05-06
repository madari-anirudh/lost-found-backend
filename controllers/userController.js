const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// =================Generate JWT ==============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ======================= REGISTER =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log("TOKEN GENERATED:", verifyToken);

    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;

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
    user.verifyToken = null;

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
    console.log("TOKEN RECEIVED:", req.params.token);

    const user = await User.findOne({ verifyToken: req.params.token });

    console.log("USER FOUND:", user);

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

// ======================= RESEND OTP =======================
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const verifyToken = crypto.randomBytes(32).toString("hex");

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.verifyToken = verifyToken;

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/api/users/verify/${verifyToken}`;

    await sendEmail(email, otp, verifyUrl);

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    console.log("RESEND OTP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};