const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const usersRouter = express.Router();

usersRouter.post("/register", async (request, response) => {
  const { username, password, firstName, lastName, email, birthday, country } =
    request.body;

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "Username or password is missing" });
  }
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: "Both username and password must be at least 3 characters long",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: "Username must be unique" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    firstName,
    lastName,
    email,
    birthday,
    country,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("items", {
    itemName: 1,
    category: 1,
    description: 1,
    startingBid: 1,
    startTime: 1,
    startDate: 1,
    endDate: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
