const Item = require("../models/Item");
const Match = require("../models/Match"); // ✅ NEW
const cloudinary = require("../config/cloudinary");

// ================= CREATE ITEM =================
exports.createItem = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lostfound_items"
      });
      imageUrl = result.secure_url;
    }

    const item = await Item.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      phone: req.body.phone,
      type: req.body.type,
      userId: req.user.id,
      image: imageUrl
    });

    res.json({
      message: "Item created",
      item
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL ITEMS =================
exports.getAllItems = async (req, res) => {
  try {

    const items = await Item.find()
      .populate("userId", "name email");

    res.json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= getMyItems =================
exports.getMyItems = async (req, res) => {
  
  try {

    // USER ITEMS
    const items = await Item.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    // LOOP ITEMS
    const updatedItems = await Promise.all(

      items.map(async (item) => {

        // FIND MATCH
        const match = await Match.findOne({

          $or: [
            { lostItem: item._id },
            { foundItem: item._id }
          ]
        });

        // NO MATCH
        if (!match) {
          return item;
        }

        // GET OPPOSITE ITEM
        let matchedItem;

        if (
          match.lostItem.toString() ===
          item._id.toString()
        ) {

          matchedItem = await Item.findById(
            match.foundItem
          );

        } else {

          matchedItem = await Item.findById(
            match.lostItem
          );
        }

        // ADD MATCHED DATA
        const obj = item.toObject();

        obj.matchedWith = matchedItem;

        return obj;

      })
    );

    res.json(updatedItems);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};
// ================= GET SINGLE ITEM =================
exports.getSingleItem = async (req, res) => {
  try {

    const item = await Item.findById(req.params.id)
      .populate("userId", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CONFIRM RECEIVED =================
exports.confirmReceived = async (req, res) => {
  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    item.status = "completed";

    await item.save();

    res.json({
      message: "Item marked as completed"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ================= MATCH ITEMS =================
exports.matchItem = async (req, res) => {
  try {
    console.log("🔥 MATCH API CALLED");
console.log("BODY:", req.body);

    const { lostItemId, foundItemId } = req.body;

    const lostItem = await Item.findById(lostItemId);
    const foundItem = await Item.findById(foundItemId);

    if (!lostItem || !foundItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ CREATE MATCH RECORD
    await Match.create({
      lostItem: lostItem._id,
      foundItem: foundItem._id,
      lostUser: lostItem.userId,
      foundUser: foundItem.userId
    });

    // ✅ UPDATE STATUS ONLY
    lostItem.status = "matched";
    foundItem.status = "matched";

    await lostItem.save();
    await foundItem.save();

    res.json({ message: "Matched successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};