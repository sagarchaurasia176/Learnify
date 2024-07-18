const mongoose = require("mongoose");
// Progress Schema Object Id
const SubSections = new mongoose.Schema({
  title: {
    type: String,
    trim:true,
  },
  timeDuration: {
    type: String,
    trim:true,

  },
  description: {
    type: String,
    trim:true,

  },
  videoUrl: {
    type: String,
    trim:true,

  },
});

module.exports = mongoose.model("Section", SubSections);
