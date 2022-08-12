const {
  createUser,
  getUsers,
  getUser,
} = require("../controllers/userController.js");

const express = require("express");

const router = express.Router();

router
  .post("/register", createUser)
  .post("/login", getUser)
  .get("/getall", getUsers);

module.exports = router;
