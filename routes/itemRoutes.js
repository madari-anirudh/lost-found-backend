const express = require("express");
const router = express.Router();

const {
  confirmReceived,
  getAllItems,
  getMyItems,
  getSingleItem,
  matchItem
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary"); // ✅ add this
const Item = require("../models/Item");

// ✅ CREATE ITEM WITH CLOUDINARY IMAGE
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {

    const { title, description, location, phone, type } = req.body;

    let imageUrl = null;

    // ✅ Upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lostfound"
      });

      imageUrl = result.secure_url; // ✅ IMPORTANT
    }

    const newItem = new Item({
      userId: req.user.id,
      title,
      description,
      location,
      phone,
      type,
      image: imageUrl   // ✅ SAVE CLOUD URL
    });

    await newItem.save();

    res.status(201).json({
      message: "Item created",
      item: newItem
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// OTHER ROUTES
router.get("/", getAllItems);
router.get("/my-items", protect, getMyItems);
router.get("/:id", getSingleItem);
router.put("/confirm/:id", protect, confirmReceived);
router.post("/match", protect, matchItem);

module.exports = router;