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

    //otp check if its exist or not
    var otpResult = await User.findOne({ otp: otp });
    while (otpResult) {
      // otp Result apply here
      otpResult = otpGenerator(5, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      //   CHECK again and again here
      otpResult = await User.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpStoredToDatabase = Otp.create(otpPayload);
    console.log(otpStoredToDatabase);

    // return the response
    return res.status(200).json({
      success: true,
      message: "Otp send Successfully !",
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

// user register  controller code apply here

 exports.singup = async(req,res)=>{
    const{fistName, lastName , email , password , confirmPassword} = req.body;
    
}




//  singup
// change password
