const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const Messenger = require("./models/Messenger");
const parentRoutes = require("./routes/parentRoutes");
const enfantRoutes = require("./routes/enfantRoutes");
const messengerRoutes = require("./routes/messengerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const donneeRoutes = require("./routes/donneeRoutes");
const prixRoutes = require("./routes/prixRoutes");
const exerciceRoutes = require("./routes/exerciceRoutes");
const bodyParser = require("body-parser");
const path = require("path");
const authMiddleware = require("./middlewares/auth");

dotenv.config();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/parents", authMiddleware, parentRoutes);
app.use("/enfants", authMiddleware, enfantRoutes);
app.use("/messengers", authMiddleware, messengerRoutes);
app.use("/notifications", authMiddleware, notificationRoutes);
app.use("/donnees", authMiddleware, donneeRoutes);
app.use("/prix", authMiddleware, prixRoutes);
app.use("/exercice", authMiddleware, exerciceRoutes);

app.get("/", (req, res) => res.send("API is running"));

sequelize.sync({ force: false })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB sync error", err));

io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("join", (userId) => {
    console.log(`👤 User joined room: ${userId}`);
    socket.join(userId.toString());
  });

  socket.on("sendMessage", async (data) => {
    const { sender_id, receiver_id, message } = data;

    try {
      const newMessage = await Messenger.create({ sender_id, receiver_id, message });
      io.to(sender_id.toString()).emit("receiveMessage", newMessage);
      io.to(receiver_id.toString()).emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Socket sendMessage error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
