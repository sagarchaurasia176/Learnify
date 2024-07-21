// This middleware is basically the application based middleware
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");

// main auth apply here
exports.authsCheck = async (req, res, next) => {
  try {
    const token =
      req.Cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");
    // check if token missing
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "token is misssing at middleware!",
        error: er.message,
      });
    }

    // token verify
    try {
      let decoded = jwt.verify(token, process.env.Secret_token);
      req.User = decoded;
    } catch (er) {
      return res.status(404).json({
        success: false,
        message: "token is invalid",
        error: er.message,
      });
    }

    next();
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "something went wrong while validating",
      error: er.message,
    });
  }
};

// isStudent middleware
exports.isStudent = async (req, res, next) => {
  try {
    // is student middleware check
    if (req.User.accountType !== "Student") {
      return res.status(404).json({
        success: false,
        message: "Protected route only for student ",
        error: er.message,
      });
    }
    next();
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Instructor role cannot be verified  ",
      error: er.message,
    });
  }
};

// isInstructor  middleware
exports.isInstructor = async (req, res, next) => {
  try {
    // is student middleware check
    if (req.User.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Protected route only for Instructor",
        error: er.message,
      });
    }
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Instructor role cannot be verified  ",
      error: er.message,
    });
  }
};

// isAdmn role middleware
exports.isAdmin = async (req, res, next) => {
  try {
    // is student middleware check
    if (req.User.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Protected route only for Instructor",
        error: er.message,
      });
    }
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Instructor role cannot be verified  ",
      error: er.message,
    });
  }
};
