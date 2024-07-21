// reset password code
const { hash } = require("crypto");
const User = require("../model/User");
const MailSender = require("../utils/MailSender");
const bcrypt = require("bcrypt");
// resetPassword
exports.resetPasswordToken = async (req, res) => {
  try {
    // get the email
    const { email } = req.body;
    // email valid
    const checkEmailIfItsExistOrNot = User.findOne({ email: email });
    if (!checkEmailIfItsExistOrNot) {
      return res.status(404).json({
        success: false,
        message: "empty field!",
      });
    }
    // users Exist
    if (checkEmailIfItsExistOrNot) {
      return res.status(404).json({
        success: false,
        message: "email already exist!",
      });
    }
    // token generate with the help of this check the password
    const token = crypto.randomUUID();
    // updates the details by adding the token and expire time
    const updateDetailsByIdAndTokeExpire = User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpire: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    //cerate url which connected with the frontend
    const url = `http://localhost:5173/update-password/${token}`;
    await MailSender(
      email,
      "password reset link ",
      `password Reset Link : ${url}`
    );

    // MAIL SEND to the gmail
    return res.status(200).json({
      success: true,
      message: "email send succeful! ",
    });

    //send mail containing the url
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "reset controller error",
      error: er.message,
    });
  }
};

// reetPasswordLogic
exports.resetPasswords = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (!password || !confirmPassword || !token) {
      return res.status(404).json({
        success: false,
        message: "empty filed of password",
        error: er.message,
      });
    }
    //get users details from db usin
    if (password !== confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "password doesn't matched",
        error: er.message,
      });
    }
    const UserDetailsToken = await User.findOne({ token: token });
    //  if details not exist then
    if (!UserDetailsToken) {
      return res.status(404).json({
        success: false,
        message: "Token is invalid",
        error: er.message,
      });
    }
    //if time expires
    if (UserDetailsToken.resetPasswordExpire < Date.now()) {
      return res.status(404).json({
        success: false,
        message: "Token expired",
        error: er.message,
      });
    }

    //password has
    const passwordBcrypt = await bcrypt.hash(password, 10);
    //update the password
    await User.findOneAndUpdate(
      { token: token },
      { password: passwordBcrypt },
      { new: true }
    );
    // return

    return res.status(200).json({
      success: true,
      message: "reset password succesfully done",
    });
    
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Password not reset! try again",
      error: er.message,
    });
  }
};
