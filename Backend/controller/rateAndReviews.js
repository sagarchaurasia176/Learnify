const { default: mongoose } = require("mongoose");
const Courses = require("../model/Courses");
const RatingAndReview = require("../model/RatingAndReview");
const path = require("path");

// create rating
exports.CreateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, CoursesId } = req.body;
    const userRatingCheck = await Courses.findOne({
      _id: CoursesId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!userRatingCheck) {
      return res.status(400).json({
        success: false,
        message: "student not enrolled in the course",
      });
    }

    // check if user exist or not for revies purpose
    const alreadyReview = await RatingAndReview.findOne({
      user: userId,
      Courses: CoursesId,
    });

    if (!alreadyReview) {
      return res.status(400).json({
        success: false,
        message: "alerady review",
      });
    }
    //   creating the rating and reviews
    const ratingAndReviews = await RatingAndReview.create({
      rating,
      review,
      Courses: CoursesId,
      user: userId,
    });
    // course update part here
    const updateCourseDetails = await Courses.findByIdAndUpdate(
      { _id: CoursesId },
      {
        $push: {
          ratingAndReviews: ratingAndReviews,
        },
      },
      { new: true }
    );
    console.log(updateCourseDetails);

    return res.status(200).json({
      success: true,
      message: "Rating and Review Succesfully !",
      data: RatingAndReview,
    });
  } catch (er) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    // error at rating and review part
  }
};

//get average rating
exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    // cal avg
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          Courses: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "Rating" },
        },
      },
    ]);

    // rating result
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if not rating exist
    return res.status(200).json({
      success: true,
      message: "average rating is 0 ",
    });

    // catch apply here
  } catch (er) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    // error at rating and review part
  }
};

// get all rating
exports.getAverageAllRating = async (rew, res) => {
  try {
    const allReview = (await RatingAndReview.find({}))
      .sort({ rating: "desc" })
      .populate({
        path: "User",
        Select: "firstName  lastName  email images",
      })
      .populate({
        path: "Courses",
        Select: "courseName",
      })
      .exec();

    // if not rating exist
    return res.status(200).json({
      success: true,
      message: "all revie fetched succesfully ",
    });
  } catch (er) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
