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
} = require("../controllers/PatientController");

router.get("/", (req, res) => {});
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.get("/:username/doctors", viewAllDoctors);

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/getPrescriptions", getPrescriptions);

module.exports = router;
