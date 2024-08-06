// start to create the routes fpr the course.js part
const express = require("express");
const routes = express.Router();
// course datas
const {
  createCourses,
  getAllCourses,
  CourseDetails,
} = require("../controller/Courses");
// course section
routes.post("/api/createCourses", createCourses);
routes.get("/api/AllCourses", getAllCourses);
routes.post("/api/CourseDetails", CourseDetails);

//categories section
//rating section
//course subSection

//middleware pars
