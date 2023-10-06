const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const DoctorRequest = require("../models/DoctorRequest");
const Patient = require("../models/Patient");
const HealthPackage = require("../models/Packages");


//View all admins 
const viewAdmins = async (req,res) => {
    try{
        const admins = await Admin.find();
        const reply = {
            success: true,
            data: admins,
            message: "Admins retrieved successfully",
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

//Add Admin
const createAdmin =  async (req,res) => {
    const attributes = {... req.body};
    try{
        const newAdmin = await Admin.create(attributes);
        const reply = {
            success: true,
            data: newAdmin,
            message: "Admin added successfully",
        };
        res.status(200).json(reply);
    } catch(error){
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
    }
};

//Remove an admin
const removeAdmin = async (req,res) => {
    const condition = {username: req.params.username};
    Admin.deleteOne(condition)
     .then(() =>{
        const reply = {
            success: true,
            data: req.params.username,
            message: "Admin removed successfully",
        };
        res.status(200).json(reply);
        })
     .catch((error) =>{
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
     });
};

//View all doctors 
const viewDoctors = async (req,res) => {
    try{
        const doctors = await Doctor.find();
        const reply = {
            success: true,
            data: doctors,
            message: "Doctors retrieved successfully",
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

//Remove a doctor
const removeDoctor = async (req,res) => {
    const condition = {username: req.params.username};
    Doctor.deleteOne(condition)
     .then(() =>{
        const reply = {
            success: true,
            data: req.params.username,
            message: "Doctor removed successfully",
        };
        res.status(200).json(reply);
        })
     .catch((error) =>{
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
     });
};

//View all patients 
const viewPatients = async (req,res) => {
    try{
        const patients = await Patient.find();
        const reply = {
            success: true,
            data: patients,
            message: "Patients retrieved successfully",
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

//Remove a patient
const removePatient = async (req,res) => {
    const condition = {username: req.params.username};
    Patient.deleteOne(condition)
     .then(() =>{
        const reply = {
            success: true,
            data: req.params.username,
            message: "Patient removed successfully",
        };
        res.status(200).json(reply);
        })
     .catch((error) =>{
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
     });
};

//View doctor applications
const viewDoctorApplications = async (req,res) => {
    try{
        const doctorRequests = await DoctorRequest.find();
        const reply = {
            success: true,
            data: doctorRequests,
            message: "Doctor applications retrieved successfully",
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

//View all health packages 
const viewHealthPackages = async (req,res) => {
    try{
        const packages = await HealthPackage.find();
        const reply = {
            success: true,
            data: packages,
            message: "Health Packages retrieved successfully",
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

//Add health package
const addHealthPackage = async (req,res) => {
    const attributes = {... req.body};
    try{
        const newHealthPackage = await HealthPackage.create(attributes);
        const reply = {
            success: true,
            data: newHealthPackage,
            message: "Health package added successfully",
        };
        res.status(200).json(reply);
    } catch(error){
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        res.status(400).json(reply);
    }
};

//Update health package
const updateHealthPackage = async (req,res) => { 
    const condition = {packageType: req.params.packageType};
    const updateData = req.body;
    const update = { $set: updateData};
    HealthPackage.updateOne(condition, update)
     .then(() => {
        const reply = {
            success: true,
            data: req.params.packageType,
            message: "Health package updated successfully",
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

//Delete health package
const deleteHealthPackage = async (req,res) => {
    const condition = {packageType: req.params.packageType};
    HealthPackage.deleteOne(condition)
     .then(() => {
        const reply = {
            success: true,
            data: req.params.packageType,
            message: "Health package deleted successfully",
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
    viewAdmins,
    createAdmin,
    removeAdmin,
    viewDoctors,
    removeDoctor,
    viewPatients,
    removePatient,
    viewDoctorApplications,
    viewHealthPackages,
    addHealthPackage,
    updateHealthPackage,
    deleteHealthPackage
};
