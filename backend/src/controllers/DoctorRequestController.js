const DoctorRequest = require("../models/DoctorRequest");


//View doctor request info 
const viewInfo = async (req,res) => {
    try{

        const username = req.body.username;
        const doctorRequest = await DoctorRequest.find({username});
        const reply = {
            success: true,
            data: doctorRequest,
            message: "Doctor request retrieved successfully",
        }
        res.status(200).json(reply);
    }catch(error){
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
    }
};


module.exports = {
    viewInfo,
};