const {
  createRoom,
  getAll,
  getOne,
  sendMsg,
  addUser,
} = require("../controllers/roomControllers.js");

const express = require("express");

const router = express.Router();

router
  .post("/getrooms", getAll)
  .post("/", createRoom)
  .get("/:id", getOne)
  .post("/:id", sendMsg)
  .put("/:id", addUser);

module.exports = router;
