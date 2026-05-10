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

    const items = await Item.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    const updatedItems = await Promise.all(

      items.map(async (item) => {

        const obj = item.toObject();

        // FIND MATCH
        const match = await Match.findOne({

          $or: [
            { lostItem: item._id },
            { foundItem: item._id }
          ]

        });

        // NO MATCH
        if (!match) {

          obj.matchDetails = null;

          return obj;
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

        // ADD MATCH DETAILS
        obj.matchDetails = {

          title: matchedItem.title,
          description: matchedItem.description,
          phone: matchedItem.phone,
          location: matchedItem.location,
          image: matchedItem.image,
          type: matchedItem.type
        };

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

    const { lostItemId, foundItemId } = req.body;

    const lostItem = await Item.findById(lostItemId);

    const foundItem = await Item.findById(foundItemId);

    if (!lostItem || !foundItem) {

      return res.status(404).json({
        message: "Item not found"
      });
    }

    // CREATE MATCH COLLECTION
    await Match.create({

      lostItem: lostItem._id,
      foundItem: foundItem._id,

      lostUser: lostItem.userId,
      foundUser: foundItem.userId
    });

    // ================= LOST ITEM =================

    lostItem.status = "matched";

    // SAVE MATCHED ITEM
    lostItem.matchedItemId = foundItem._id;

    // SAVE MATCHED USER
    lostItem.matchedWith = foundItem.userId;

    // ================= FOUND ITEM =================

    foundItem.status = "matched";

    foundItem.matchedItemId = lostItem._id;

    foundItem.matchedWith = lostItem.userId;

    // SAVE BOTH
    await lostItem.save();

    await foundItem.save();

    res.json({
      message: "Matched successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};