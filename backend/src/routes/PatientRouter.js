const express = require("express");
const router = express.Router();
const Appointments = require("../models/Appointments");

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
  linkFamMember,
  getAllFreeDocAppointments
} = require("../controllers/PatientController");
const { create } = require("../models/Patient");

router.get("/freeAppointments", getAllFreeDocAppointments);
router.get("/:username", getPatientAPI);
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.post("/:username/doctors", viewAllDoctors);
router.post("/:username/doctors/available", viewAllDoctorsAvailable);
router.post("/createDoc", createDoc); // TESTING PURPOSES ONLY

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//link family member route
router.patch("/:username/linkFamMember", linkFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/prescriptions", getPrescriptions);

module.exports = router;
