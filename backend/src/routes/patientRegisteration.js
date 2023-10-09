const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
//const Doctor = require("../models/Doctor");

//reply to get requests with hello
router.get("/", (req, res) => {
  res.json({ msg: "hello" });
});

//create one Patient
router.post("/registerPatient", async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    gender,
    mobileNumber,
    emergencyContact,
  } = req.body;

  try {
    const patient = await Patient.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
    });
    res.status(200).json({ msg: patient + " created patient successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//send request to get registered as a doctor
// router.post("/registerRequestDoctor", (req, res) => {
//   res.json({ msg: "sent request to get registered as a doctor" });
// });

module.exports = router;
