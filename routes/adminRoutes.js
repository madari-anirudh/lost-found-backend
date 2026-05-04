const express = require("express");
const router = express.Router();

const {
  getMatchedItems,
  registerAdmin,
  adminLogin,
  getLostItems,
  getFoundItems,
  matchItems
} = require("../controllers/adminController");

// Admin authentication
router.post("/register", registerAdmin);
router.post("/login", adminLogin);

// Admin dashboard APIs
router.get("/lost-items", getLostItems);
router.get("/found-items", getFoundItems);
router.post("/match", matchItems);
router.get("/matched-items", getMatchedItems);

module.exports = router;