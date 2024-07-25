const { error } = require("console");
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure you load environment variables

// cloudinary config()
cloudinary.config({
  CLOUD_API: process.env.CLOUD_API,
  CLOUD_SECRET: process.env.CLOUD_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
});

const MediaUploaderToCloud = async (
  file,
  folder,
  height,
  quality,
  res
) => {
  try {
    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file, options);
  } // catch apply here
    catch (er) {
      console.log("error ")
  }
};

module.exports = MediaUploaderToCloud;
