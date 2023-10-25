const express = require("express");
const router = express.Router();
const Doctor = require("../models/DoctorRequest");

//get all doctor requests
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({
      messgage: " got all doctor requests successfully",
      status: true,
      data: doctors,
    });
  } catch (err) {
    res.status(400).json({
      messgage: " Failed to get all doctor requests.",
      status: false,
      data: null,
    });
  }
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
    const doctor = await Doctor.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliatedHospital,
      educationalBackground,
    });
    res.status(200).json({
      messgage: "Submitted Application successfully",
      status: true,
      data: doctor,
    });
  } catch (err) {
    res.status(400).json({
      messgage: " Failed to submit request.",
      status: false,
      data: null,
    });
  }
});

module.exports = router;
