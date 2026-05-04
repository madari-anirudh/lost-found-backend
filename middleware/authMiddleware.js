const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH USER FROM DB (IMPORTANT FIX)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ Attach FULL user
    req.user = user;

    console.log("Logged User:", req.user);

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token failed" });
  }
};

module.exports = { protect };