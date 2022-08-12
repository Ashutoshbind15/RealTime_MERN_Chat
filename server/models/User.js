const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
