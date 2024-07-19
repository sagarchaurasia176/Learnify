const Otp = require("../model/Otp");
const User = require("../model/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const jwt = require("jsonwebtoken");
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
exports.singup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      confirmPassword,
      otp,
    } = req.body;

    // validattions, if anything is not be occured
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(404).json({
        success: false,
        message: "field is empty ! kindly fill it",
      });
    }

    //   passwrod and confirm passwrod
    if (password !== confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "password doesn't matched!",
      });
    }

    //check if the users exist or not
    const userExistOrNotCheckFromTheDb = User.findOne({ email: email });
    if (userExistOrNotCheckFromTheDb) {
      return res.status(404).json({
        success: false,
        message: "email already exist! kindly login it ",
      });
    }

    // Find most recent otp using its time
    const recentOtp = await Otp.find({ email: email })
      .sort({ createdAt: -1 })
      .limit(-1);
    if (recentOtp.length == 0) {
      return res.status(404).json({
        success: false,
        message: "otp is empty from server side",
      });
    } else if (otp !== recentOtp.otp) {
      // check for invalid otp first
      return res.status(404).json({
        success: false,
        message: "Invalid otp",
      });
    }
    // start to hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOFBirth: null,
      about: null,
      contactNumber: null,
    });
    // start to stroed the data into the db
    const singupDataStoredToDb = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      contactNumber,
      additionalDetails: ProfileDetails._id,
      confirmPassword,
      otp,
      images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });
    return res.status(200).json({
      success: true,
      data: singupDataStoredToDb,
      message: "Singup Succesfully done!",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "error in SingUpcontroller !",
      error: er.message,
    });
  }
};

// loginController
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "field is empty !",
        error: er.message,
      });
    }
    // check the email
    const checkEmailIfItsExistOrNot = await User.findOne({
      email: email,
    }).populate("additionalDetails");
    if (checkEmailIfItsExistOrNot) {
      return res.status(404).json({
        success: false,
        message: "email already exist here!",
        error: er.message,
      });
    }

    // payload apply here for the jwt purposed
    const payload = {
      id: checkEmailIfItsExistOrNot._id,
      email: checkEmailIfItsExistOrNot.email,
      role: checkEmailIfItsExistOrNot.role,
    };
    // password compared first
    const passwordCompared = bcrypt.compare(
      password,
      checkEmailIfItsExistOrNot.password
    );
    if (await passwordCompared) {
      const token = jwt.sign(payload, process.env.Secret_token, {
        expiresIn: "2h",
      });
      checkEmailIfItsExistOrNot.token = token;
      checkEmailIfItsExistOrNot.password = undefined;
      // now start to create the cookies for saved the data
      // options for cookies
      const Options = {
        expires: new Date.now() + 3 * 24 * 60 * 60 * 100,
        httpOnly: true,
      };

      res.Cookies("edtech-login-users", token, Options).status(200).json({
        success: true,
        token,
        message: "Cookies stored succesfully !",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Incorect password !",
        error: er.message,
      });
    }
    // stored the data into the db
    // return response apply there so we get
    return res.status(200).json({
      success: true,
      message: "login Succesfully done",
    });

    // stored the data into the db
    // const loginDataStoredToDb = await
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Login failed in the controller !",
      error: er.message,
    });
  }
};

// change password

// pending 😔

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "field is empty !",
        error: er.message,
      });
    }
  } catch (er) {}
};
// check the email
