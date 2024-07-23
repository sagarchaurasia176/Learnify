const Razorpay = require("razorpay");
require("dotenv").config();
// create the instance of the razor pay
exports.instance = new Razorpay({
      key_id: process.env.RAZOR_KEY,
      key_secret: process.env.RAZOR_SECRET,
    });

