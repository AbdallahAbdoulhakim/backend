const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const loginMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.jwttoken || req?.token;
    const decoded = await jwt.decode(token, process.env.JWT_SECRET);

    if (!token || !decoded) {
      res.status(401);
      throw new Error("Unauthenticated : No valid bearer token was provided! ");
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Unauthenticated : User provided does not exist ! ");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }

    res.user = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    next(error);
  }
});

const adminMiddleware = (req, res, next) => {
  try {
    const user = res?.user;

    if (!user.isAdmin) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

const ownMiddleware = (req, res, next) => {
  try {
    const id = req.id;

    if (!res.user.id === id) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

const allowAllOrigin = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
};

module.exports = {
  loginMiddleware,
  adminMiddleware,
  ownMiddleware,
  allowAllOrigin,
};
