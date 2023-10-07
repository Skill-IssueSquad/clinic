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
  createDoc
} = require("../controllers/PatientController");
const { create } = require("../models/Patient");

router.get("/", (req, res) => {});
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.get("/:username/doctors", viewAllDoctors);
router.get("/:username/doctors/available", viewAllDoctorsAvailable);
router.post("/createDoc", createDoc); // TESTING PURPOSES ONLY

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/getPrescriptions", getPrescriptions);

module.exports = router;
