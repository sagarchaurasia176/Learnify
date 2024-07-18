const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
// connectious mountings
app.use(express.json());
// dbconnection
const dbConnectionFunctionCall = require("./config/Edtechdb");
dbConnectionFunctionCall();
// routes done
const routes = require("./routes/EdtechMainRoutes");


