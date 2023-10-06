const Patient = require("../models/Patient");
const mongoose = require("mongoose");

//assuming the patient already exists (otherwise they would
//be filling the registration form and we would be creating a new patient)
const addFamMember = async (req, res) => {
  const { username } = req.params;
  const { name, nationalID, age, gender, relation } = req.body;

  const patient = await Patient.find({ username: username }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: "${err.message}",
    });
  });

  if (!patient) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Patient not found",
    });
  }
  console.log(patient.extfamilyMembers);
  return res.status(200).json({
    success: true,
    data: patient.extfamilyMembers,
    message: "Family member added successfully",
  });
};

module.exports = { addFamMember };
