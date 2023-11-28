const express = require("express");
const router = express.Router();
const Appointments = require("../models/Appointments");
const multer = require("multer");
const path = require("path");

//const path = require("path")
//const multer = require("multer")

let nameFile;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "documents");
  },
  filename: (req, file, cb) => {
    nameFile = Date.now() + "--" + file.originalname;
    req.nameFile = nameFile;
    cb(null, nameFile);
  },
});
const upload = multer({ storage: storage });
const { authPatient } = require("../middleware/Authentication");

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
  getPatientAPIByID,
  linkFamMember,
  cancelHealthPackage,
  tempSub,
  getAllFreeDocAppointments,
  getPatientBookingOptions,
  bookAppointment,
  getPatientemUsername,
  AddHealthRecord,
  getAllHealthRecords,
  removeHealthRecord,
  rescheduleAppointment,
  actualSub,
} = require("../controllers/PatientController");

const { create } = require("../models/Patient");
//const upload = multer({ storage: storage }).single('document');
router.post(
  "/:username/healthrecords",
  upload.single("document"),
  AddHealthRecord
);

router.delete("/:username/healthrecords/:recordId", removeHealthRecord);
//router.post('/patients/:username/healthrecords', upload, AddHealthRecord);
router.get("/:username/healthrecords", getAllHealthRecords);

router.get("/:username/bookingOptions", getPatientBookingOptions);
router.get("/freeAppointments", getAllFreeDocAppointments);
router.get("/:username", getPatientAPI);
router.get("/getByID/:id", getPatientAPIByID);
router.get("/email/:username", getPatientemUsername);
router.get("/:username/appointments", getAllAppointments);
router.get("/:username/appointments/date", getAppointmentsByDate);
router.get("/:username/appointments/status", getAppointmentsByStatus);
router.post("/:username/doctors", viewAllDoctors);
router.post("/:username/doctors/available", viewAllDoctorsAvailable);
router.post("/createDoc", createDoc); // TESTING PURPOSES ONLY
router.post("/:username/bookAppointment", bookAppointment);
router.post("/:username/reschduleAppointment", rescheduleAppointment);

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//link family member route
router.patch("/:username/linkFamMember", linkFamMember);

//get family members route
router.get("/:username/getFamMember", getFamMembers);

//get prescriptions route
router.get("/:username/prescriptions", getPrescriptions);

//subscribe health package route (temp and will be removed )
router.post("/:username/subscriptions/transitSub", tempSub);
router.patch("/:username/subscriptions/subscribe", actualSub);

//cancel health package subscription route
router.patch("/:username/subscriptions/cancel", cancelHealthPackage);

module.exports = router;
