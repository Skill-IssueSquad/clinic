const Doctor = require("../models/Doctor");

const getDoctor = async (req, res) => {
  const doctor = await Doctor.find({ name: "Mohamed Bahy" }).catch((err) => {
    res.status(500).json({ message: "Doctor not found" });
  });
  if (!doctor) {
    res.status(404).json({ message: "Doctor not found" });
  }
  res.status(200).json(doctor);
};

const createDoctor = async (req, res) => {
  //   console.log(req.body);
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliatedHospital,
      educationalBackground,
      contracts,
      patientList,
    } = req.body;
    const doctor = await Doctor.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliatedHospital,
      educationalBackground,
      contracts,
      patientList,
    });
    if (!doctor) {
      throw new Error("Doctor not created");
    }
    // console.log("I am here");
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};

module.exports = { getDoctor, createDoctor };
