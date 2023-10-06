const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentsByStatus,
  viewAllDoctors,
} = require("../controllers/PatientController");

router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.get("/:username/doctors", viewAllDoctors);   

module.exports = router;
