const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ KEEP HERE

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});