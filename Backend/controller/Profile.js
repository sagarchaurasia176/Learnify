const Profile = require("../model/Profile");
const User = require("../model/User");

exports.updateProfile = async (req, res) => {
  try {
    const { dateOFBirth = "", about = "", contactNumber, gender } = req.body;
    //get userId
    const id = req.User.id;
    //validation
    if (!contactNumber || !gender || !about || !dateOFBirth) {
      return res.status(404).json({
        success: false,
        message: "All fields are required!",
        error: er.message,
      });
    }
    const userDetails = await User.findById(id);
    const ProfileId = userDetails.additionalDetails;
    const ProfileDetails = await Profile.findById(ProfileId);
    // update profile
    ProfileDetails.dateOFBirth = dateOFBirth;
    ProfileDetails.about = about;
    ProfileDetails.gender = gender;
    ProfileDetails.contactNumber = contactNumber;

    // await save to the databse
    await ProfileDetails.save();
    return res.status(200).json({
      success: true,
      message: "Profile Updated Succesfully!",
    });
  } catch (er) {
    return res.status(404).json({
      success: false,
      message: "Profile not created!",
      error: er.message,
    });
  }
};

// delete accounts
exports.ProfileDeleteAccount = async (req, res) => {
  try {
    const id = req.User.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user not found!",
        error: er.message,
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "user profiel deleted succesfully!",
    });
  } catch (er) {
    return res.status(400).json({
      success: false,
      message: "user profile not deleted succesfully!",
    });
  }
};

// how to apply the job - chron job

// userAll details
exports.getUserDetails = async(req,res){
    try{
        const id = req.User.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //valid 
        return res.status(200).json({
            success: true,
            message: "user data received!",
            userDetails
          });
        //response

    }catch(er){
        return res.status(400).json({
            success: false,
            message: "user details not received !",
          });
    }
}
