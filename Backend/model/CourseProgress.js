const mongoose = require("mongoose");
// Progress Schema Object Id
const Progress = mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completeVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("Progress", Progress);
