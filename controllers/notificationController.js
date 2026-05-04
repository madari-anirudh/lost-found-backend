const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};