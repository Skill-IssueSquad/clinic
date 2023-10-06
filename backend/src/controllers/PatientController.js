const Patient = require("../models/Patient");
const mongoose = require("mongoose");
const Prescription = require("../models/Prescription");
const { json } = require("express");

//assuming the patient already exists (otherwise they would
//be filling the registration form and we would be creating a new patient)
const addFamMember = async (req, res) => {
  const { name, nationalID, age, gender, relation, healthPackageType } =
    req.body;
  const { username } = req.params;

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

  //add new family member info to extfamilyMembers array
  patient.extfamilyMembers.push({
    name: name,
    national_id: nationalID,
    relation: relation, //wife, husband, son, daughter
    age: age,
    gender: gender, //M, F, Bahy
    healthPackageType: healthPackageType,
  });

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

  const newPatient = await Patient.findOne({
    username: req.params.username,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: "${err.message}",
    });
  });

  res.status(200).json({
    success: true,
    data: newPatient,
    message: "Family member added successfully",
  });
};

//get registered family members
const getFamMembers = async (req, res) => {
  const { username } = req.params;

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

  res.status(200).json({
    success: true,
    data: patient.extfamilyMembers,
    message: "Family members retrieved successfully",
  });
};

//get prescriptions
const getPrescriptions = async (req, res) => {
  const { username } = req.params;

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

  //print all prescription ids
  console.log("Here are the prescription ids:");
  console.log(patient.perscreption_ids);

  const prescriptions = [];

  //go look for those prescriptions
  patient.perscreption_ids.forEach(async (prescription) => {
    const prescription_id = prescription.prescription_id;
    const prescriptionObj = await Prescription.findById(prescription_id).catch(
      (err) => {
        return res.status(500).json({
          success: false,
          data: null,
          message: "${err.message}",
        });
      }
    );

    //print the prescription object
    console.log(prescriptionObj);

    //add the prescription object to the prescriptions array
    prescriptions.push(prescriptionObj);
  });

  //return the results
  res.status(200).json({
    success: true,
    data: prescriptions,
    message: "Prescriptions retrieved successfully",
  });
};

module.exports = { addFamMember, getFamMembers, getPrescriptions };
