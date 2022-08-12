const connectDB = require("./config/db.js");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
const dotenv = require("dotenv");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);

let users = [];

const userAdditionHandler = (userId, socketId) => {
  const newUser = { userId, socketId };
  users.push(newUser);
};

const disconnectHandler = (sid) => {
  users = users.filter((user) => user.socketId !== sid);
};

io.on("connection", (socket) => {
  socket.on("addUsers", (userId) => {
    userAdditionHandler(userId, socket.id);
  });

  socket.on("disconnect", () => {
    disconnectHandler(socket.id);
  });

  socket.on("message", (data, receivers, room, sender) => {
    receivers.forEach((el) => {
      const receiver = users.find((u) => u.userId === el);
      if (receiver) {
        io.to(receiver.socketId).emit("rmessage", data, room, sender);
      }
    });
  });

  socket.on("addToRoom", (receivers, room) => {
    receivers.forEach((el) => {
      const receiver = users.find((u) => u.userId === el);
      if (receiver) {
        io.to(receiver.socketId).emit("addToRoom", room);
      }
    });
  });
});

server.listen(3000, () => {
  console.log("listening on :3000");
});
