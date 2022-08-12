const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = { Room };
