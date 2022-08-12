const { User } = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const findUser = await User.findOne({ email });

  if (findUser) return res.status(400).json({ msg: "User already exists" });

  const newUser = await User.create({
    name,
    password: hashedPassword,
    email,
  });

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      friends: newUser.friends,
      _id: newUser._id,
    },
    token,
  });
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isAllowed = await bcrypt.compare(password, user.password);

  if (!isAllowed) return res.sendStatus(403);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      friends: user.friends,
      _id: user._id,
    },
    token,
  });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
