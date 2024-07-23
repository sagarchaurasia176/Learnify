const Category = require("../model/Category");
const Courses = require("../model/Courses");
const User = require("../model/User");
const { MediaUploaderToCloud } = require("../utils/MediaUploderToCloud");
require("dotenv").config();
// pending
exports.createCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // get the thumbnail apply here
    const thumbnail = req.files.thumbnailImage;
    // check the validation of the required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !status ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // if status is undefined
    if (!status || status === undefined) {
      status = "Draft";
    }
    // check if the user is an instructor
    const instructoDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    if (!instructoDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // check if the tag is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    // uplaod the thumbnail to the cloundinary
    const thumbnailImage = await MediaUploaderToCloud(
      thumbnail,
      process.env.FOLDER
    );
    // CREATE new course
    const newCourse = await Courses.create({
      courseName,
      courseDescription,
      instuctor: instructoDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions: instructions,
    });

    // add the new course to the user schema of the instructor
    await User.findByIdAndUpdate(
      {
        _id: instructoDetails._id,
      },
      {
        $push: {
          Courses: newCourse._id,
        },
      },
      { new: true }
    );

    // add the new course category
    await Category.findByIdAndUpdate(
      { _id: category },
      { $push: { Courses: newCourse._id } },
      { new: true }
    ); // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (er) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// to get all the course from the codehelp
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Courses.find(
      {},
      {
        courseName: true,
        price: true,
        thumbNail: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("Instructor")
      .exec();
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (er) {
    //   to passed the error
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// getCourseDetails
exports.CourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetail = await Courses.find({ _id: courseId })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("Category")
      .populate(" ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetail) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: courseDetail,
    });
  } catch (er) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
