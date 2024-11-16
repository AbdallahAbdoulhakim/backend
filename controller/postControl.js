const postModel = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

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
        }
      : null;

    res.status(200).json({
      success: true,
      data: {
        id: post._id,
        user: user,
        title: post.title,
        body: post.body,
      },
      message: "Post retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getPosts = asyncHandler(async (req, res, next) => {
  const postLabels = {
    totalDocs: "postsCount",
    docs: "postsList",
    page: "currentPage",
  };

  try {
    const { offset, limit, search } = req?.query;

    const options = {
      offset: parseInt(offset) ? parseInt(offset) : 0,
      limit: parseInt(limit)
        ? parseInt(limit) > 10
          ? 10
          : parseInt(limit)
        : 5,
      customLabels: postLabels,
      sort: { createdAt: -1 },
      populate: "user",
    };

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { body: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const result = await postModel.paginate(query, options);

    const postsList = result.postsList.map((post) => ({
      id: post.id,
      user: {
        id: post.user._id,
        firstname: post.user.firstname,
        lastname: post.user.lastname,
      },
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: { ...result, postsList: postsList },
      message: "Posts retrievd successfully",
    });
  } catch (error) {
    next(error);
  }
});

const updatePost = asyncHandler(async (req, res, next) => {
  try {
    const user = await userModel.findById(res?.user?.id);
    let newOwner = {};

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : User does not exist ! ");
    }

    let post = await postModel.findById(req?.params?.id);

    if (!post) {
      res.status(404);
      throw new Error("Post does not exist ! ");
    }

    const owner = await userModel.findById(post.user);

    if (
      (owner._id !== user._id && !user.isAdmin) ||
      (!owner.isActive && owner._id === user._id)
    ) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }

    if (
      !Object.keys(req?.body).includes("title") &&
      !Object.keys(req?.body).includes("body") &&
      !Object.keys(req?.body).includes("user")
    ) {
      res.status(400);
      throw new Error(
        "Bad request : Please provide  the title or the body to be updated!"
      );
    }

    if (req.body?.user) {
      const isValid = ObjectId.isValid(req.body.user);
      if (!isValid) {
        res.status(400);
        throw new Error("Bad request: provided user is not a valid bson id!");
      }
      newOwner = await userModel.findById(req.body.user);

      if (!newOwner) {
        res.status(400);
        throw new Error("Bad request: provided user does not exist!");
      }
    }

    const newPost = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const userPost = Object.keys(newOwner).length
      ? {
          id: newOwner.id,
          firstname: newOwner.firstname,
          lastname: newOwner.lastname,
        }
      : {
          id: owner.id,
          firstname: owner.firstname,
          lastname: owner.lastname,
        };

    res.status(200).json({
      success: true,
      data: {
        id: newPost._id,
        user: userPost,
        title: newPost.title,
        body: newPost.body,
      },
      message: "Post updated successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const deletePost = asyncHandler(async (req, res, next) => {
  try {
    const user = await userModel.findById(res?.user?.id);

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : User does not exist ! ");
    }

    let post = await postModel.findById(req?.params?.id);

    if (!post) {
      res.status(404);
      throw new Error("Post does not exist ! ");
    }

    const owner = await userModel.findById(post.user);

    if (
      (owner._id !== user._id && !user.isAdmin) ||
      (!owner.isActive && owner._id === user._id)
    ) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }

    const deletedPost = await postModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        id: deletedPost._id,
        user: {
          id: owner.id,
          firstname: owner.firstname,
          lastname: owner.lastname,
        },
        title: deletedPost.title,
        body: deletedPost.body,
      },
      message: "Post deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { createPost, getPost, getPosts, updatePost, deletePost };
