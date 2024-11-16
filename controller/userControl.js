const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const data = req?.body;
    const newUser = await userModel.create(data);

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        mobile: newUser.mobile,
        isActive: newUser.isActive,
        isAdmin: newUser.isAdmin,
      },
      message: "User created successfully!",
    });
  } catch (err) {
    next(err);
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const data = req?.body;
    const id = req?.params?.id || res?.user?.id;

    const updatedUser = await userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isActive: updatedUser.isActive,
        isAdmin: updatedUser.isAdmin,
      },
      message: "User updated successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req?.params?.id || res?.user?.id;

    const user = await userModel.findById(id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      },
      message: "User retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req?.params?.id || res?.user?.id;
    const deletdUser = await userModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {
        id: deletdUser._id,
        firstname: deletdUser.firstname,
        lastname: deletdUser.lastname,
        email: deletdUser.email,
        mobile: deletdUser.mobile,
        isActive: deletdUser.isActive,
        isAdmin: deletdUser.isAdmin,
      },
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      data: users.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      })),
      message: "Users retrieved successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const blockUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req?.params?.id || res?.user?.id;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isActive: updatedUser.isActive,
        isAdmin: updatedUser.isAdmin,
      },
      message: "User blocked successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const unblockUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req?.params?.id || res?.user?.id;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { isActive: true },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isActive: updatedUser.isActive,
        isAdmin: updatedUser.isAdmin,
      },
      message: "User unblocked successfully!",
    });
  } catch (error) {
    next(error);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const data = req?.body;

  try {
    if (
      !Object.keys(data).includes("email") ||
      !Object.keys(data).includes("password")
    ) {
      res.status(400);
      throw new Error(
        "Bad request : You must provide email and password to login!"
      );
    }

    const user = await userModel.findOne({ email: data.email });

    const verified = await user?.verify(data?.password);

    if (!user || !verified) {
      res.status(404);
      throw new Error("Invalid Credentials!");
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwttoken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User successfully logged in",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  blockUser,
  unblockUser,
  getUsers,
  loginUser,
};
