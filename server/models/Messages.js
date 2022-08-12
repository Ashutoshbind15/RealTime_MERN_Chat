const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  text: String,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = { Message };
