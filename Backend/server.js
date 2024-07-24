const express = require("express");
// frontend  + backend conenction requrired cors
const cors = require("cors");
//file upload
const fileUpload = require("express-fileupload");
// cloudinary connected
const MediaUploaderToCloud = require("./utils/MediaUploderToCloud");
// for middleware purpose
const cookieParser = require("cookie-parser");
// app for mounting purpose
const app = express();
// dotenv file
require("dotenv").config();
// dbconnection
const dbConnectionFunctionCall = require("./config/Edtechdb");
// Multiple routes for different routes
const CourseRoutes = require("./routes/Course");
const PaymentRoutes = require("./routes/Payment");
const ProfileRoutes = require("./routes/Profile");
const UserRoutes = require("./routes/User");
// Port listen
const PORT = process.env.PORT || 8000;
// connectious mountings
app.use(express.json());
// dbconnection
dbConnectionFunctionCall();

// main listen port
app.listen(PORT, () => {
  console.log(`server moving at this ${PORT}`);
});
