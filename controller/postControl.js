const postModel = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const createPost = asyncHandler(async (req, res, next) => {
  try {
    const id = res.user.id;
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
    res.status(201).json({
      success: true,
      data: { user: res.user, title: newPost.title, body: newPost.body },
      message: "Post created successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getPost = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;

    const post = await postModel.findById(id);

    if (!post) {
      res.status(404);
      throw new Error("Post Not found!");
    }

    const retrievedUser = await userModel.findById(post.user);

    const user = retrievedUser
      ? {
          id: retrievedUser.id,
          firstname: retrievedUser.firstname,
          lastname: retrievedUser.lastname,
          email: retrievedUser.email,
          mobile: retrievedUser.mobile,
          isActive: retrievedUser.isActive,
          isAdmin: retrievedUser.isAdmin,
        }
      : null;

    res.status(200).json({
      success: true,
      data: {
        success: true,
        data: { id: post._id, user: user, title: post.title, body: post.body },
      },
      message: "Post retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getPosts = asyncHandler(async (req, res, next) => {
  try {
    const posts = await postModel.find();

    res.status(200).json({
      success: true,
      data: posts.map((post) => ({
        id: post._id,
        userId: post.user,
        title: post.title,
        body: post.body,
      })),
      message: "Posts retrievd successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { createPost, getPost, getPosts };
