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

//View doctor request info 
const viewPDF = async (req,res) => {
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


//Update doctor request info
const updateInfo = async (req,res) => { 
    const condition = {username: req.params.username};
    const updateData = req.body;
    console.log(updateData);
    console.log(condition);
    const update = { $set: updateData};
    DoctorRequest.updateOne(condition, update)
     .then(() => {
        const reply = {
            success: true,
            data: req.params.username,
            message: "Doctor request updated successfully",
        };
        res.status(200).json(reply);
     })
     .catch((error) => {
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
     })
};

module.exports = {
    viewInfo,
    updateInfo
};