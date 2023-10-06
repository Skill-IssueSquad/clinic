const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointments = require("../models/Appointments");
const Prescription = require("../models/Prescription");

//assuming the patient already exists (otherwise they would
//be filling the registration form and we would be creating a new patient)
const addFamMember = async (req, res) => {
  const { name, nationalID, age, gender, relation, healthPackageType } =
    req.body;
  const { username } = req.params;

  try {
    const patient = await getPatient(username);
    if (patient) {
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

      return res.status(200).json({
        success: true,
        data: newPatient,
        message: "Family member added successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Patient not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

//get registered family members
const getFamMembers = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await getPatient(username);
    if (patient) {
      return res.status(200).json({
        success: true,
        data: patient.extfamilyMembers,
        message: "Family members retrieved successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Patient not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

//get prescriptions
const getPrescriptions = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await getPatient(username);
    if (patient) {
      //print all prescription ids
      console.log("Here are the prescription ids:");
      console.log(patient.perscreption_ids);

      const prescriptions = [];

      //go look for those prescriptions
      patient.perscreption_ids.forEach(async (prescription) => {
        const prescription_id = prescription.prescription_id;
        const prescriptionObj = await Prescription.findById(
          prescription_id
        ).catch((err) => {
          return res.status(500).json({
            success: false,
            data: null,
            message: "${err.message}",
          });
        });

        //print the prescription object
        console.log(prescriptionObj);

        //add the prescription object to the prescriptions array
        prescriptions.push(prescriptionObj);
      });

      //return the results
      return res.status(200).json({
        success: true,
        data: prescriptions,
        message: "Prescriptions retrieved successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Patient not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

async function getPatient(username) {
  try {
    const user = await Patient.findOne({ username: username }).catch((err) => {
      return null;
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  } catch (err) {
    return null;
  }
}

const getAllAppointments = async (req, res) => {
  // Used when the front end handles the sorting
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (patient) {
      const appointments = await Appointments.find({
        patient_id: patient._id,
      }).catch((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            data: null,
            message:
              err.message ||
              "Some error occurred while retrieving appointments.",
          });
        }
      });

      return res.status(200).json({
        success: true,
        data: appointments,
        message: "Successfully retrieved all appointments",
      });
    } else {
      // username does not exist
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const getAppointmentsByDate = async (req, res) => {
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, { date: "2021-04-20" }
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    const appointments = await Appointments.find({
      patient_id: patient._id,
      date: req.body.date,
    }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: req.body.date,
          message:
            err.message || "Some error occurred while retrieving appointments.",
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Successfully retrieved all appointments",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const getAppointmentsByStatus = async (req, res) => {
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, { status: "upcoming" }
  // status: "(upcoming, completed, cancelled, rescheduled)"
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    // check for invalid status
    if (
      !["upcoming", "completed", "cancelled", "rescheduled"].includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        success: false,
        data: req.body.status,
        message:
          "Invalid status " +
          req.body.status +
          ". Valid statuses are (upcoming, completed, cancelled, rescheduled).",
      });
    }

    const appointments = await Appointments.find({
      status: req.body.status,
      patient_id: patient._id,
    }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: req.body.status,
          message:
            err.message || "Some error occurred while retrieving appointments.",
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Successfully retrieved all appointments",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: req.body.status,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const viewAllDoctors = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: username
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    let doctors = await Doctor.find().catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving doctors.",
        });
      }
    });

    doctors = doctors.map((doctor) => {
      // get each doctors markup from contract
      if (doctor.contracts.length > 0) {
        const markup = doctor.contracts[0].markupOnSalary;

        // check on health package type for discount
        let discount = 0;
        if (patient.healthPackageType) {
          if (patient.healthPackageType.status === "subscribed") {
            if (patient.healthPackageType.type === "silver") {
              discount = 0.4;
            } else if (patient.healthPackageType.type === "platinum") {
              discount = 0.8;
            } else if (patient.healthPackageType.type === "gold") {
              discount = 0.6;
            }
          }
        }

        const sessionPrice =
          (doctor.hourlyRate + 0.1 * markup) * (1 - discount);

        // Return a new object with the modified properties
        return { ...doctor._doc, sessionPrice };
      } else {
        // no contract for this doctor
        const sessionPrice = -1;

        // Return a new object with the modified properties
        return { ...doctor._doc, sessionPrice };
      }
    });

    return res.status(200).json({
      success: true,
      data: doctors,
      message: "Successfully retrieved all doctors",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving doctors.",
    });
  }
};

module.exports = {
  addFamMember,
  getFamMembers,
  getPrescriptions,
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentsByStatus,
  viewAllDoctors,
};
