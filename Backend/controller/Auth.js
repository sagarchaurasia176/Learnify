const { error } = require("console");
const Otp = require("../model/Otp");
const User = require("../model/User");
const otpGenerator = require("otp-generator");
// send otp code
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email: email });
    // check if the email is exist or not
    if (checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: "email already exist!",
      });
    }
    //gernerate the otp here
    let otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // check if the otp exist or unique or not




  } catch (er) {
    return res.status(404).json({
        success: false,
        message: "error in Auth controller !",
        error: er.message,
      });
  }
};

// login
//  singup
// change password
