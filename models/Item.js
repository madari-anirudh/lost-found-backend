const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  description: String,
  type: {
    type: String,
    enum: ["lost", "found"]
  },

  phone: String,
  location: String,
  status: {
    type: String,
    default: "searching"
  },

  matchedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },

  matchedWith: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},
  
  image: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);