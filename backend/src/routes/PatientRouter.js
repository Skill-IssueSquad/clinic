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
  cancelAppointment,
  requestFollowUp,
  editWalletBalance,
  getTransitData,
  payDoctorScheduledFollowUp,
  tempBookAppointment,
  tempRequestFollowUp,
  tempPayDoctorFollowUp,
  sendEmail,
  AddNotification,
  getAllUnseenNotifications,
  markNotificationAsSeen
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
router.post("/:username/tempBook", tempBookAppointment); // TESTING PURPOSES ONLY
router.post("/:username/reschduleAppointment", rescheduleAppointment);
router.delete(
  "/:username/appointments/:doctor_id/:appointment_id",
  cancelAppointment
);
router.post("/:username/requestFollowUp", requestFollowUp);
router.post("/:username/tempRequestFollowUp", tempRequestFollowUp); // TESTING PURPOSES ONLY
router.put("/:username/editWalletBalance", editWalletBalance);
router.get("/transitPay/:transit_id", getTransitData);
router.post("/:username/docFollowUpPay", payDoctorScheduledFollowUp); 
router.post("/:username/tempDocFollowUpPay", tempPayDoctorFollowUp); 

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
router.post("/:username/subscriptions/subscribe", actualSub);

//cancel health package subscription route
router.patch("/:username/subscriptions/cancel", cancelHealthPackage);

//add family member route
router.patch("/:username/addFamMember", addFamMember);

//send email
router.patch("/:sendEmail", sendEmail);

router.post("/:addNotification",AddNotification);

router.get("/getAllUnseenNotifications/:username",getAllUnseenNotifications);

router.patch("/markNotificationAsSeen/:username/:notificationId",markNotificationAsSeen);




module.exports = router;
