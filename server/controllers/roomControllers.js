const { Room } = require("../models/Conversation.js");
const { Message } = require("../models/Messages.js");

const getAll = async (req, res) => {
  const rooms = await Room.find({});

  const requiredRooms = rooms.filter((room) =>
    room.users.includes(req.body.userId)
  );

  res.status(200).json(requiredRooms);
};

const getOne = async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate({
      path: "chats",
      populate: {
        path: "sender",
        select: "name",
      },
    })
    .populate("users");

  res.status(200).json(room);
};

const sendMsg = async (req, res) => {
  const room = await Room.findById(req.params.id);

  const msg = new Message(req.body);

  room.chats.push(msg);
  await msg.save();
  await room.save();
  res.status(200).json(room);
};

const createRoom = async (req, res) => {
  const { name, userId } = req.body;
  const newRoom = await Room.create({ name });

  newRoom.users.push(userId);

  await newRoom.save();

  res.status(200).json(newRoom);
};

const addUser = async (req, res) => {
  const room = await Room.findById(req.params.id);

  const { userIds } = req.body;

  userIds.forEach((element) => {
    room.users.push(element);
  });

  await room.save();

  res.status(200).json(room);
};

module.exports = {
  createRoom,
  getAll,
  getOne,
  sendMsg,
  addUser,
};
