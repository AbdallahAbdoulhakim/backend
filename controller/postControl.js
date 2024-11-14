const postModel = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const createPost = asyncHandler(async (req, res, next) => {
  try {
    const id = req.user.id;
    const data = req.body;

    if (
      !Object.keys(data).includes("body") ||
      !Object.keys(data).includes("title")
    ) {
      res.status(400);
      throw new Error("Bad request! You must provide title and body!");
    }

    const newUser = await userModel.findById(id);

    const newPost = await postModel.create({
      user: newUser,
      title: data.title,
      body: data.body,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { createPost };
