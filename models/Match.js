const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

  lostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  lostUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  foundUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);