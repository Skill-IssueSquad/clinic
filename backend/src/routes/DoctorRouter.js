const router = require("express").Router();
const {
  getDoctor,
  createDoctor,
  updateDoctor,
  getAppointments,
  createPatient,
  createAppointment,
} = require("../controllers/DoctorController");
router.get("/:username", getDoctor);
router.post("/create", createDoctor);
router.put("/update/:username", updateDoctor);
router.get("/appointments/:username", getAppointments);
router.post("/createPatient", createPatient);
router.post("/createAppointment", createAppointment);
module.exports = router;
