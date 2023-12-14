const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const DoctorRequest = require("../models/DoctorRequest");
const Patient = require("../models/Patient");
const HealthPackage = require("../models/Packages");
const bcrypt = require('bcrypt')


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
const createAdmin = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            username: username,
            password: hashedPassword,
            email: email,
        });
        const reply = {
            success: true,
            data: newAdmin,
            message: "Admin added successfully",
        };
        return res.status(200).json(reply);
    } catch (error) {
      let err;
      if (error.message.includes("E11000 duplicate key error collection: Pharmacy.admins index: username_1 dup key")){
        err = "Username is already taken"
      }
      else if (error.message.includes("E11000 duplicate key error collection: Pharmacy.admins index: email_1 dup key")){
        err = "Email is already taken"
      }
      const reply = {
        success: false,
        data: null,
        message: err,
      };
      return res.status(500).json(reply);
    }
  };
  

//Remove an admin
const removeAdmin = async (req,res) => {
    console.log(req.params);
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

//Accept doctor request
const acceptDoctor = async (req,res) => {
    try{
        const username = req.body.user;
        const doctorRequest = await DoctorRequest.findOneAndUpdate({username: username}, {$set: {status: "Accepted"}});
        const doctor = await Doctor.create(
            {
                username: doctorRequest.username,
                name: doctorRequest.name,
                email: doctorRequest.email,
                password: doctorRequest.password,
                dateOfBirth: doctorRequest.dateOfBirth,
                hourlyRate: doctorRequest.hourlyRate,
                affiliatedHospital: doctorRequest.affiliatedHospital,
                educationalBackground: doctorRequest.educationalBackground,
            }
        );
        const reply = {
            success: true,
            data: doctor,
            message: "Doctor has been accepted successfully",
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

//Reject doctor request
const rejectDoctor = async (req,res) => {
    const condition = {username: req.body.user};
    const update = { $set: {status: "Rejected"} };
    DoctorRequest.updateOne(condition, update)
    .then(() => {
       const reply = {
           success: true,
           data: req.params.packageType,
           message: "Doctor has been rejected successfully",
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
    attributes.packageType = attributes.packageType.charAt(0).toUpperCase() + attributes.packageType.slice(1);
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
    console.log(updateData);
    console.log(condition);
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
    acceptDoctor,
    rejectDoctor,
    viewHealthPackages,
    addHealthPackage,
    updateHealthPackage,
    deleteHealthPackage
};
