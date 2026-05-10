const Item = require("../models/Item");
const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Match = require("../models/Match");

// =============================
// Admin Login
// =============================
exports.adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// =============================
// Get Lost Items
// =============================
exports.getLostItems = async (req, res) => {

  try {

    const items = await Item.find({
      type: "lost",
      status: "searching"
    }).populate("userId");

    res.json(items);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// =============================
// Get Found Items
// =============================
exports.getFoundItems = async (req, res) => {

  try {

    const items = await Item.find({
      type: "found"
    }).populate("userId");

    res.json(items);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// =============================
// Match Items + Notifications
// =============================

exports.matchItems = async (req, res) => {

  try {

    const { lostItemId, foundItemId } = req.body;

    const Item = require("../models/Item");

    // FIND ITEMS
    const lostItem = await Item.findById(lostItemId);

    const foundItem = await Item.findById(foundItemId);

    if (!lostItem || !foundItem) {

      return res.status(404).json({
        message: "Items not found"
      });
    }

    // UPDATE STATUS
    
    // UPDATE BOTH ITEMS

await Item.findByIdAndUpdate(
  lostItemId,
  {
    status: "matched",
    matchedWith: foundItemId
  }
);

await Item.findByIdAndUpdate(
  foundItemId,
  {
    status: "matched",
    matchedWith: lostItemId
  }
);
    // SOCKET NOTIFICATION
    if (global.io) {

      global.io.emit("itemMatched", {

        userId: lostItem.user,

        message:
          `Your lost item "${lostItem.title}" may be matched!`
      });

      global.io.emit("itemMatched", {

        userId: foundItem.user,

        message:
          `Your found item "${foundItem.title}" may be matched!`
      });
    }

    res.json({
      message: "Items matched successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};


// =============================
// Admin Register (Temporary)
// =============================
exports.registerAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      email,
      password: hashedPassword
    });

    await admin.save();

    res.json({
      message: "Admin created successfully",
      admin
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// =============================
// Get Matched Items (Solved)
// =============================
exports.getMatchedItems = async (req, res) => {

  try {

    const items = await Item.find({
      status: "matched"
    })
      .populate("userId")
      .populate("matchedWith");

    res.json(items);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};