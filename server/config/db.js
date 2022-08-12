const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB conn");
};

module.exports = connectDB;
