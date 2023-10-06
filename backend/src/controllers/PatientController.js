const Patient = require("../models/Patient");
const mongoose = require("mongoose");

//assuming the patient already exists (otherwise they would
//be filling the registration form and we would be creating a new patient)
const addFamMember = async (req, res) => {
  const { username } = req.params;
  const { name, nationalID, age, gender, relation, healthPackageType } =
    req.body;

  const patient = await Patient.findOne({ username: username }).catch((err) => {
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

  //check if extFamilyMembers array is undefined
  if (!patient.extfamilyMembers) {
    patient.extfamilyMembers = [];
  }

  //new family member info
  const newFamMember = {
    name: name,
    national_id: nationalID,
    relation: relation, //wife, husband, son, daughter
    age: age,
    gender: gender, //M, F, Bahy
    healthPackageType: healthPackageType,
  };

  //add to extfamilyMembers array
  patient.extfamilyMembers.push(newFamMember);

  //update the existing patient
  await Patient.findByIdAndUpdate(patient._id, {
    extfamilyMembers: patient.extfamilyMembers,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: "${err.message}",
    });
  });

  const newPatient = await Patient.findOne({ username: username }).catch(
    (err) => {
      return res.status(500).json({
        success: false,
        data: null,
        message: "${err.message}",
      });
    }
  );

  res.status(200).json({
    success: true,
    data: newPatient,
    message: "Family member added successfully",
  });
};

module.exports = { addFamMember };
