const express = require("express");
const router = express.Router();
const Doctor = require("../models/DoctorRequest");

//reply to get requests with hello
router.get("/", (req, res) => {
  res.json({ msg: "hello" });
});

//Request registeration as doctor
router.post("/", async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    hourlyRate,
    affiliatedHospital,
    educationalBackground,
  } = req.body;

  try {
    const patient = await Doctor.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliatedHospital,
      educationalBackground,
    });
    res.status(200).json({ msg: patient + " created patient successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
