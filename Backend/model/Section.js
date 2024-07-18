const mongoose = require("mongoose");
// Progress Schema Object Id
const Sections = new mongoose.Schema({
  SectionName: {
    type: String,
    trim:true,
  },
  SubSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSections",
    },
  ],
   

});

module.exports = mongoose.model("Sections", Sections);
