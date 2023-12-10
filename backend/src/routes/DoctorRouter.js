const router = require("express").Router();
const { authDoctor } = require("../middleware/Authentication");

const multer = require("multer");
var crypto = require("crypto");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    // You can write your own logic to define the filename here (before passing it into the callback), e.g:
    console.log(file.originalname); // User-defined filename is available
    const filename = `file_${file.originalname}`; // Create custom filename (crypto.randomUUID available in Node 19.0.0+ only)
    callback(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576, // Defined in bytes (1 Mb)
  },
});

const {
  getDoctor,
  createDoctor,
  updateDoctor,
  getAppointments,
  createPatient,
  createAppointments,
  getPatients,
  saveFile,
  createAppointment,
  approveDoctor,
  addMoney,
  acceptContract,
  addSlot,
  getSchedule,
  addAppointment,
  getMarkup,
  cancelAppointment,
  addToPrescription,
  getMedicinesStatus,
  removeFromPrescription,
  getRequestedAppointments,
  acceptAppointment,
  revokeAppointment,
  getPatient,
  getPrescriptions,
  getChatPatients,
  saveAdditionalMedicines,
} = require("../controllers/DoctorController");
router.get("/:username", getDoctor);
router.post("/create", createDoctor);
router.put("/update/:username", updateDoctor);
router.get("/appointments/:username", getAppointments);
router.post("/createPatient", createPatient);
router.post("/createAppointments", createAppointments);
router.get("/getPatients/:username", getPatients);
router.post("/createAppointment", createAppointment);
router.post("/saveFile", upload.any(), saveFile);
router.post("/approveDoctor/:username", approveDoctor);
router.post("/addMoney/:username", addMoney);
router.post("/acceptContract/:username", acceptContract);
router.post("/addSlot/:username", addSlot);
router.post("/schedule/:username", getSchedule);
router.post("/addAppointment/:username", addAppointment);
router.get("/contract/getMarkup/:username", getMarkup);
router.post("/cancelAppointment/:username", cancelAppointment);
router.post("/addToPrescription/", addToPrescription);
router.post("/getMedicinesStatus/", getMedicinesStatus);
router.post("/removeFromPrescription/", removeFromPrescription);
router.get("/getRequestedAppointments/:username", getRequestedAppointments);
router.post("/acceptAppointment/:username", acceptAppointment);
router.post("/revokeAppointment", revokeAppointment);
router.get("/getPatient/:appID", getPatient);
router.get("/getPrescriptions/:username", getPrescriptions);
router.get("/chat/getPatients/:username", getChatPatients);
router.post("/saveAdditionalMedicines", saveAdditionalMedicines);

module.exports = router;
