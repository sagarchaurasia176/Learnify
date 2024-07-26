const express = require("express");
const CourseRoutes = express.Router();

const {
  createCourses,
  getAllCourses,
  CourseDetais,
} = require("../controller/Courses");
// categroy controller
const {
  createCategory,
  categoryPageDetails,
} = require("../controller/Category");
// sections
const {
  createCourse,
  updateSection,
  deleteSections,
} = require("../controller/Sections");
// subsections
const {
  CreateSubSection,
  updateSubSections,
  deleteSubSection,
} = require("../controller/SubSection");
//Routing controller improt
const {
  CreateRating,
  getAverageRating,
  getAverageAllRating,
} = require("../controller/rateAndReviews");

// import all the middleware
const {
  authsCheck,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middleware/authsMiddleware");

// course croutes creations
CourseRoutes.post("/createCourse", authsCheck, isInstructor, createCourse);
CourseRoutes.post("/addSection", authsCheck, isInstructor, createCourse);
CourseRoutes.post("/updateSection", authsCheck, isInstructor, updateSection);
CourseRoutes.post("/deleteSection", authsCheck, isInstructor, deleteSections);
CourseRoutes.post(
  "/updateSubSection",
  authsCheck,
  isInstructor,
  updateSubSections
);
CourseRoutes.post(
  "/deleteSubSection",
  authsCheck,
  isInstructor,
  deleteSubSection
);
CourseRoutes.post("/addSubSection", authsCheck, isInstructor, CreateSubSection);
CourseRoutes.post("/getAllCourses", getAllCourses);
CourseRoutes.post("/CourseDetails", CourseDetais);

// category Routes
CourseRoutes.post("/createCategory", authsCheck, isAdmin, createCategory);
CourseRoutes.get("/showAllCategory", categoryPageDetails);
CourseRoutes.post("/getCategoryPageDetails", categoryPageDetails);

// rating and reviews

CourseRoutes.post("/createRating", authsCheck, isStudent, CreateRating);
CourseRoutes.get("/getAverageRating", getAverageRating);
CourseRoutes.get("/getReviews", getAverageAllRating);

module.exports = CourseRoutes;
