const mongoose = require("mongoose");
const EditProfile = mongoose.Schema({
  gender: {
    type: String,
  },
  dateOFBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", EditProfile);
