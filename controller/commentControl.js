const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { isValidBson } = require("../config/utils");

const asyncHandler = require("express-async-handler");

const createComment = asyncHandler(async (req, res, next) => {
  try {
    const post = await postModel.findById(req?.params?.id);

    if (!req?.body?.body) {
      res.status(400);
      throw new Error("Bad request : You need to provide the comment body!");
    }

    if (!post) {
      res.status(404);
      throw new Error("Post does not exist");
    }
    const user = await userModel.findById(res?.user?.id);

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : You must login to comment!");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("Unauthorized : You are not allow to use this resource!");
    }

    const createdComment = await commentModel.create({
      body: req.body.body,
      user: user._id,
      post: post._id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: createdComment._id,
        postId: createdComment.post,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        body: createdComment.body,
      },
    });
  } catch (error) {
    next(error);
  }
});

const updateComment = asyncHandler(async (req, res, next) => {
  try {
    if (!isValidBson(req?.params?.id)) {
      res.status(400);
      throw new Error("Bad request : Not a valid comment id");
    }

    const comment = await commentModel.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment does not exist!");
    }

    const user = await userModel.findById(res?.user?.id);

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : You must login to comment!");
    }

    if (
      user._id.toString() !== comment.user.toString() ||
      (user._id.toString() === comment.user.toString() && !user.isActive)
    ) {
      res.status(403);
      throw new Error("Unauthorized : You are not allow to use this resource!");
    }

    if (!Object.keys(req.body).includes("body")) {
      res.status(400);
      throw new Error(
        "Bad request : You must provide the comment body to be updated!"
      );
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.id,
      {
        body: req.body.body,
      },
      { new: true }
    );

    const commentOwner = await userModel.findById(updatedComment.user);

    res.status(200).json({
      success: true,
      data: {
        id: updatedComment._id,
        postId: updatedComment.post,
        user: commentOwner
          ? {
              id: commentOwner.id,
              firstname: commentOwner.firstname,
              lastname: commentOwner.lastname,
            }
          : null,
        body: updatedComment.body,
      },
      message: "Comment updated successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const deleteComment = asyncHandler(async (req, res, next) => {
  try {
    if (!isValidBson(req?.params?.id)) {
      res.status(400);
      throw new Error("Bad request : Not a valid comment id");
    }

    const comment = await commentModel.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error("Comment does not exist!");
    }

    const user = await userModel.findById(res?.user?.id);

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : You must login to comment!");
    }

    if (
      (user._id.toString() !== comment.user.toString() && !user.isAdmin) ||
      (user._id.toString() === comment.user.toString() && !user.isActive)
    ) {
      res.status(403);
      throw new Error("Unauthorized : You are not allow to use this resource!");
    }

    const deletedComment = await commentModel.findByIdAndDelete(req.params.id);

    const commentOwner = await userModel.findById(deletedComment.user);

    res.status(200).json({
      success: true,
      data: {
        id: deletedComment._id,
        postId: deletedComment.post,
        user: commentOwner
          ? {
              id: commentOwner.id,
              firstname: commentOwner.firstname,
              lastname: commentOwner.lastname,
            }
          : null,
        body: deletedComment.body,
      },
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getCommentById = asyncHandler(async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req?.params?.id);
    if (!comment) {
      res.status(404);
      throw new Error("Comment does not exist!");
    }

    const commentOwner = await userModel.findById(comment.user);

    res.status(200).json({
      success: true,
      data: {
        id: comment._id,
        postId: comment.post,
        user: commentOwner
          ? {
              id: commentOwner.id,
              firstname: commentOwner.firstname,
              lastname: commentOwner.lastname,
            }
          : null,
        body: comment.body,
      },
      message: "Comment retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getPostComments = asyncHandler(async (req, res, next) => {
  try {
    const post = await postModel.findById(req?.params?.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found!");
    }

    const comments = await commentModel.find({ post: post }).populate("user");

    res.status(200).json({
      success: true,
      data: comments.map((comment) => ({
        id: comment._id,
        user: {
          id: comment.user._id,
          firstname: comment.user.firstname,
          lastname: comment.user.lastname,
        },
        postId: comment.post,
        body: comment.body,
        createAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })),
      message: "comments retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  getPostComments,
};
