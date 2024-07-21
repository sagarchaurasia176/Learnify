const SubSection = require("../model/SubSection");
const section = require("../model/Section");
const { MediaUploaderToCloud } = require("../utils/MediaUploderToCloud");
const Section = require("../model/Section");

// subSections handler
exports.CreateSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    // extract video using the cloudinary
    const video = req.files.videoFile;
    // validation check
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(404).json({
        success: false,
        message: "empty field in subsection part",
        error: er.message,
      });
    }
    // video upload to the cloud parts
    const videoUploadDetailsToCloudinary = await MediaUploaderToCloud(
      video,
      process.env.FOLDER
    );
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: videoUploadDetailsToCloudinary.secure_url,
    });

    // update the section here
    const uploadSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          SubSections: subSectionDetails._id,
        },
      },
      { new: true }
    );

    // return the response
    return res.status(200).json({
      success: true,
      message: "Sub section Successfully  done!",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "subSection not created err in controller!",
      error: er.message,
    });
  }
};

//update sections => pending 
exports.updateSubSections = async()=>{
    try{
      
    }catch(er){

    }
}

// delete sections
