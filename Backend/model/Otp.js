const mongoose = require("mongoose");
const MailSender = require("../utils/MailSender");
const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// a fucntion => which transform the mails directly to the server
async function otpMailTransfterDirectlyToTheServer(email, otp) {
  try {
    const mailResponse = await MailSender(
      email,
      "verification Email  from edtech ",
      otp
    );
    console.log(mailResponse);
  } catch {
    console.log("error in opt schema");
  }
}

// preSaved middleware for sending previous logics 
// its basically contained the schema for middleware purpose

    OtpSchema.pre('save' , async function(next){
        await otpMailTransfterDirectlyToTheServer(this.email , this.otp);
    // passed the middleware 
        next();
    })


module.exports = mongoose.model("Otp", OtpSchema);
