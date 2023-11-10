const express = require("express");
const router = express.Router();
const Appointments = require("../models/Appointments");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './Documents/';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'document-' + uniqueSuffix + fileExtension);
  },
});
const {
  addFamMember,
  getFamMembers,
  getPrescriptions,
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentsByStatus,
  viewAllDoctors,
  viewAllDoctorsAvailable,
  createDoc,
  getPatientAPI,
  getPatientemUsername,
  AddHealthRecord,
} = require("../controllers/PatientController");


const { create } = require("../models/Patient");
const upload = multer({ storage: storage }).single('document');

router.post('/patients/:username/healthrecords', upload, AddHealthRecord);

router.get("/:username", getPatientAPI);
router.get("/email/:username", getPatientemUsername);
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.post("/:username/doctors", viewAllDoctors);
router.post("/:username/doctors/available", viewAllDoctorsAvailable);
router.post("/createDoc", createDoc); // TESTING PURPOSES ONLY

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/getPrescriptions", getPrescriptions);

module.exports = router;
