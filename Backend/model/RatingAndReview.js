const mongoose = require("mongoose");
// Progress Schema Object Id
const RatingAndReview = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("RatingAndReview", RatingAndReview);
