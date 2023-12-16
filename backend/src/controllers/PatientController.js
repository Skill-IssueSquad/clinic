const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointments = require("../models/Appointments");
const Prescription = require("../models/Prescription");
const Packages = require("../models/Packages");
const Clinic = require("../models/Clinic");
const mongoose = require("mongoose");
const PaymentTransit = require("../models/PaymentTransit");
const axios = require("axios");

const getPatientAPI = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await getPatient(username);
    if (patient) {
      return res.status(200).json({
        success: true,
        data: patient,
        message: "Patient retrieved successfully",
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
        error.message || "Some error occurred while retrieving patients.",
    });
  }
};

const editWalletBalance = async (req, res) => {
  try {
    const username = req.params.username;
    const newWalletBalance = req.body.walletBalance;

    const patient = await Patient.findOneAndUpdate(
      { username: username },
      { walletBalance: newWalletBalance },
      { new: true }
    ).catch((err) => {
      return res.status(500).json({
        success: false,
        data: { newWalletBalance, username },
        message:
          err.message || "Some error occurred while updating wallet balance.",
      });
    });

    return res.status(200).json({
      success: true,
      data: { patient, newWalletBalance },
      message: "Wallet balance updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        error.message || "Some error occurred while updating wallet balance.",
    });
  }
};

const getPatientAPIByID = async (req, res) => {
  const { id } = req.params;
  // console.log("The new acc");
  // console.log(id);

  try {
    const patient = await Patient.findById(id);
    if (patient) {
      return res.status(200).json({
        success: true,
        data: patient,
        message: "Patient retrieved successfully",
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
        error.message || "Some error occurred while retrieving patients.",
    });
  }
};

//assuming the patient already exists (otherwise they would
//be filling the registration form and we would be creating a new patient)
const addFamMember = async (req, res) => {
  const { name, national_id, age, gender, relation, healthPackageType } =
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
        national_id: national_id,
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
          message: err.message || "Some error occurred while updating patient.",
        });
      });

      const newPatient = await Patient.findOne({
        username: req.params.username,
      }).catch((err) => {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving patient.",
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
        error.message || "Some error occurred while retrieving patients.",
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
        error.message || "Some error occurred while retrieving patients.",
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

      //create an array to store the prescriptions
      var prescriptions = [];

      for (const prescription of patient.perscreption_ids) {
        const prescription_id = prescription.prescription_id;

        const prescriptionObj = await Prescription.findById(
          prescription_id
        ).catch((err) => {
          return res.status(500).json({
            success: false,
            data: null,
            message:
              err.message ||
              "Some error occurred while retrieving prescriptions.",
          });
        });

        let finalObj = {
          prescription_id: prescription_id,
          doctor_name: null,
          date: null,
          PharmacySubmitStatus: prescriptionObj.PharmacySubmitStatus,
          isFilled: prescriptionObj.isFilled.toString(),
          medicines: prescriptionObj.medicines,
        };

        const appointObj = await Appointments.findOne({
          prescription_id: prescription_id,
          patient_id: patient._id,
        }).catch((err) => {
          return res.status(500).json({
            success: false,
            data: null,
            message:
              err.message ||
              "Some error occurred while retrieving appointments.",
          });
        });

        if (appointObj) {
          //search for doctor name
          finalObj.date = appointObj.date;

          const doctorObj = await Doctor.findById(appointObj.doctor_id).catch(
            (err) => {
              return res.status(500).json({
                success: false,
                data: null,
                message:
                  err.message ||
                  "Some error occurred while retrieving doctors.",
              });
            }
          );

          if (doctorObj) {
            finalObj.doctor_name = doctorObj.name;
          }
        }
        //print the prescription object
        console.log(finalObj);

        //add the prescription object to the prescriptions array
        prescriptions.push(finalObj);

        //print the prescriptions array
        //console.log("Here is the prescriptions array (in):");
        //console.log(prescriptions);
      }

      //console.log("Here is the prescriptions array (out):");
      //console.log(prescriptions);

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
        error.message || "Some error occurred while retrieving patients.",
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

      let fullAppointments = [];

      for (const appointment of appointments) {
        const fullAppointment = {
          ...appointment._doc,
          doctor_name: "",
        };

        await Doctor.findById(appointment.doctor_id)
          .then((doctor) => {
            fullAppointment.doctor_name = doctor.name;
          })
          .catch((err) => {
            console.log(
              err + "doctor with id: " + appointment.doctor_id + " not found"
            );
          });

        fullAppointments.push(fullAppointment);
      }

      return res.status(200).json({
        success: true,
        data: { appointments: fullAppointments, amountDue: patient.amountDue },
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

    let doctors = await Doctor.find({ contractAccepted: true }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving doctors.",
        });
      }
    });

    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const markup = (await Clinic.findOne({})).markupPercentage;

    var doctorsRes = [];
    

    for (const doctor of doctors) {

      // get each doctors markup from contract
      // if (doctor.contracts.length > 0) {

      let isPatientToDoc = false;
      for (const dPatient of doctor.patientList) {
        if (String(dPatient.patient_id) === String(patient._id)) {
          isPatientToDoc = true;
          break;
        }
      }

      // check on health package type for discount
      let discount = 0;

      let sessionPrice = (
        (doctor.hourlyRate / 2) *
        (1 + markup / 100) *
        (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
      ).toFixed(2);


      // Return a new object with the modified properties
      doctorsRes.push({ ...doctor._doc, sessionPrice, isPatientToDoc });
      //   } else {
      //     // no contract for this doctor
      //     const sessionPrice = -1;

      //     // Return a new object with the modified properties
      //     return { ...doctor._doc, sessionPrice };
      //   }
    };

    return res.status(200).json({
      success: true,
      data: { doctors: doctorsRes, amountDue: patient.amountDue, patientId: patient._id},
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

const viewAllDoctorsAvailable = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, { datetime: "2022-05-01T00:00:00.000+00:00" }
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

    // try to validate datetime
    if (isNaN(Date.parse(req.body.datetime))) {
      return res.status(400).json({
        success: false,
        data: "" + req.body.datetime,
        message: "Invalid datetime format",
      });
    }

    let doctors = await Doctor.find({
      contractAccepted: true,
      availableSlots: {
        $elemMatch: {
          startTime: { $lte: req.body.datetime },
          endTime: { $gt: req.body.datetime },
        },
      },
    }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving doctors.",
        });
      }
    });

    console.log("DOCS MATCHING: ", doctors);

    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const markup = (await Clinic.findOne({})).markupPercentage;

    doctors = doctors.map((doctor) => {
      // get each doctors markup from contract
      // if (doctor.contracts.length > 0) {

      // check on health package type for discount
      let discount = 0;

      let sessionPrice = (
        (doctor.hourlyRate / 2) *
        (1 + markup / 100) *
        (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
      ).toFixed(2);

      

      // Return a new object with the modified properties
      return { ...doctor._doc, sessionPrice};
      //   } else {
      //     // no contract for this doctor
      //     const sessionPrice = -1;

      //     // Return a new object with the modified properties
      //     return { ...doctor._doc, sessionPrice };
      //   }
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

const getAllFreeDocAppointments = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: { doctor_id: "69fe353h55g3h34hg53h" }
  try {
    // get doctor_id from query params
    const docName = (await Doctor.findById(req.query.doctor_id)).name;
    const appointments = await Doctor.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query.doctor_id),
        },
      },
      {
        $unwind: "$availableSlots",
      },
      {
        $match: {
          "availableSlots.isBooked": false,
        },
      },
      {
        $project: {
          doctor_name: "$name",
          availableSlot: "$availableSlots",
        },
      },
    ]).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving appointments.",
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {doc_name: docName , appointments: appointments},
      message: "Successfully retrieved all appointments",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: req.params.doctor_id,
      message: err.message,
    });
  }
};

const getPatientBookingOptions = async (req, res) => {
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

    const bookingOptions = [];

    // pushing self
    bookingOptions.push({
      patient_id: patient._id,
      patient_name: patient.name,
      national_id: "",
      type: "Yourself",
      relation: "",
    });

    // pushing linked family members
    for (const linked of patient.linkedAccounts) {
      const patient_id = linked.patient_id;
      const patient_name = await Patient.findById(patient_id)
        .then((patient) => {
          return patient.name;
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            data: patient_id,
            message:
              err.message || "Some error occurred while retrieving patient.",
          });
        });

      bookingOptions.push({
        patient_id: patient_id,
        patient_name: patient_name,
        national_id: "",
        type: "linked Account",
        relation: linked.relation,
      });
    }

    // pushing external family members
    for (const familyMember of patient.extfamilyMembers) {
      bookingOptions.push({
        patient_id: patient._id,
        patient_name: familyMember.name,
        national_id: familyMember.national_id,
        type: "external family member",
        relation: familyMember.relation,
      });
    }

    return res.status(200).json({
      success: true,
      data: bookingOptions,
      message: "Successfully retrieved all booking options",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  //    startTime: "2022-05-01T00:00:00.000+00:00", day: "2023-4-5", timeSlot: "22:00",
  //    patient_id, national_id(can be null), patient_name, slot_id}
  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      return String(elem.patient_id) === String(req.body.patient_id);
    }) ? true : false;
    if (String(patient._id) !== String(req.body.patient_id) && !isLinked) {
      return sendResponse(
        401,
        false,
        req.body,
        "Unauthorized to book appointment for this patient"
      );
    }

    // edit availableSlots array in doctor
    const doctor = await Doctor.findByIdAndUpdate(
      { _id: req.body.doctor_id },
      {
        $set: {
          "availableSlots.$[elem].isBooked": true,
          "availableSlots.$[elem].patientName": req.body.patient_name,
          "availableSlots.$[elem].appointmentType": "appointment",
        },
      },
      {
        arrayFilters: [
          { "elem._id": new mongoose.Types.ObjectId(req.body.slot_id) },
        ],
        new: true,
      }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while updating doctor."
        );
      }
    });

    if (!doctor) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor."
      );
    }
    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const markup = (await Clinic.findOne({})).markupPercentage;


    const sessionPrice = (
      (doctor.hourlyRate / 2) *
      (1 + markup / 100) *
      (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
    ).toFixed(2);

    // create new appointment
    const appointment = await Appointments.create({
      doctor_id: req.body.doctor_id,
      type: "appointment",
      date: req.body.startTime,
      day: req.body.day,
      slot: req.body.timeSlot,
      patient_id: req.body.patient_id,
      prescription_id: null,
      familyMember_nationalId: req.body.national_id,
      status: "upcoming",
      price: {
        doctor: sessionPrice,
        patient: sessionPrice,
      },
    }).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while creating appointment."
        );
      }
    });

    if (!appointment) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while creating appointment."
      );
    } else {
      // check patient list
      let found = doctor.patientList.includes(req.body.patient_id);

      if (!found) {
        doctor.patientList.push({ patient_id: req.body.patient_id });
      }

      await Doctor.findByIdAndUpdate(
        { _id: req.body.doctor_id },
        { 
          patientList: doctor.patientList,
          $inc: { walletBalance: appointment.price.doctor },
        }
      ).catch((err) => {
        if (err) {
          return sendResponse(
            500,
            false,
            req.body,
            err.message || "Some error occurred while updating doctor patients."
          );
        }
      });
    }

    return sendResponse(
      200,
      true,
      appointment,
      "Appointment created successfully"
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      req.body,
      err.message || "Some error occurred while creating appointment."
    );
  }
};

const tempBookAppointment = async (req, res) => {
  
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  //    startTime: "2022-05-01T00:00:00.000+00:00", day: "2023-4-5", timeSlot: "22:00",
  //    patient_id, national_id(can be null), patient_name, slot_id}
  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      return String(elem.patient_id) === String(req.body.patient_id);
    }) ? true : false;
    if (String(patient._id) !== String(req.body.patient_id) && !isLinked) {
      return sendResponse(
        401,
        false,
        req.body,
        "Unauthorized to book appointment for this patient"
      );
    }

    // edit availableSlots array in doctor
    const doctor = await Doctor.findById(
      req.body.doctor_id,
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while fetching doctor."
        );
      }
    });

    if (!doctor) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor."
      );
    }
    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const markup = (await Clinic.findOne({})).markupPercentage;


    const sessionPrice = (
      (doctor.hourlyRate / 2) *
      (1 + markup / 100) *
      (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
    ).toFixed(2);

    // create entry in payment transit
    const paymentTransit = await PaymentTransit.create({
      totalPrice: sessionPrice,
      items: [
        {
            name: `Appointment with ${doctor.name} on ${req.body.day} at ${req.body.timeSlot} for ${req.body.patient_name}` ,
            quantity: 1,
            price: sessionPrice,
        },
      ],
      payload: req.body,
      postURL: `patient/${username}/bookAppointment`,
    }).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while creating payment entry."
        );
      }
    });

    
    return sendResponse(
      200,
      true,
      {transit_id: paymentTransit._id},
      "Appointment created successfully"
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      req.body,
      err.message || "Some error occurred while creating appointment."
    );
  }

}

const rescheduleAppointment = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  // appointment_id: "69fe353h55g3h34hg53h", date: "2022-05-01T00:00:00.000+00:00", day: "2023-4-5", slot: "22:00",
  // slot_id: "69fe353h55g3h34hg53h"}

  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    // get the old appointment
    const editableAppointment = await Appointments.findById(
      req.body.appointment_id
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while retrieving appointment."
        );
      }
    });

    if (editableAppointment.status !== "upcoming") {
      return sendResponse(
        400,
        false,
        req.body,
        "Cannot reschedule appointment that is not upcoming"
      );
    }

    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      return String(elem.patient_id) === String(editableAppointment.patient_id);
    })
      ? true
      : false;
    if (
      String(patient._id) !== String(editableAppointment.patient_id) &&
      !isLinked
    ) {
      return sendResponse(
        401,
        false,
        {
          ...req.body,
          pid: patient._id,
          app_p_pid: editableAppointment.patient_id,
        },
        "Unauthorized to reschedule appointment for this patient"
      );
    }

    // free up the old slot
    const doctor = await Doctor.findByIdAndUpdate(
      { _id: req.body.doctor_id },
      {
        $set: {
          "availableSlots.$[elem].isBooked": false,
          "availableSlots.$[elem].patientName": null,
          "availableSlots.$[elem].appointmentType": null,
        },
      },
      {
        arrayFilters: [
          {
            "elem.day": editableAppointment.day,
            "elem.timeSlot": editableAppointment.slot,
          },
        ],
        new: true,
      }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message ||
            "Some error occurred while updating doctor's free slots."
        );
      }
    });

    if (!doctor) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor free slots."
      );
    }

    const patient_name = doctor.availableSlots.find((elem) => {
      elem.day === editableAppointment.day &&
        elem.timeSlot === editableAppointment.slot;
    })?.patientName;

    // book the new slot
    const doctorNewSlot = await Doctor.findByIdAndUpdate(
      { _id: req.body.doctor_id },
      {
        $set: {
          "availableSlots.$[elem].isBooked": true,
          "availableSlots.$[elem].patientName": patient_name,
          "availableSlots.$[elem].appointmentType": "appointment",
        },
      },
      {
        arrayFilters: [
          { "elem._id": new mongoose.Types.ObjectId(req.body.slot_id) },
        ],
        new: true,
      }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message ||
            "Some error occurred while updating doctor's new slots."
        );
      }
    });

    if (!doctorNewSlot) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor new slots."
      );
    }

    // update appointment
    const appointment = await Appointments.findByIdAndUpdate(
      { _id: req.body.appointment_id },
      {
        $set: {
          status: "rescheduled",
        },
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while updating appointment."
        );
      }
    });

    if (!appointment) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while creating appointment."
      );
    }

    // create new appointment
    const newAppointment = await Appointments.create({
      doctor_id: editableAppointment.doctor_id,
      type: "appointment",
      date: req.body.date,
      day: req.body.day,
      slot: req.body.slot,
      patient_id: editableAppointment.patient_id,
      prescription_id: editableAppointment.prescription_id,
      familyMember_nationalId: editableAppointment.familyMember_nationalId,
      status: "upcoming",
      price: editableAppointment.price,
    }).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while creating appointment."
        );
      }
    });

    return sendResponse(
      200,
      true,
      appointment,
      "Appointment rescheduled successfully"
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      req.body,
      err.message || "Some error occurred while reschduling appointment."
    );
  }
};

const requestFollowUp = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  // appointment_id: "69fe353h55g3h34hg53h", date: "2022-05-01T00:00:00.000+00:00", day: "2023-4-5", slot: "22:00",
  // slot_id: "69fe353h55g3h34hg53h"}

  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    // get the old appointment
    const completedAppointment = await Appointments.findById(
      req.body.appointment_id
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while retrieving appointment."
        );
      }
    });

    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      return String(elem.patient_id) === String(completedAppointment.patient_id);
    })
      ? true
      : false;
    if (
      String(patient._id) !== String(completedAppointment.patient_id) &&
      !isLinked
    ) {
      return sendResponse(
        401,
        false,
        {
          ...req.body,
          pid: patient._id,
          app_p_pid: completedAppointment.patient_id,
        },
        "Unauthorized to request follow-up for this patient"
      );
    }

    // get patient name
    const currPatient = await Patient.findById(
      completedAppointment.patient_id
    ).catch((err) => {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while retrieving patient name."
      );
    });

    // book the new slot
    const doctorNewSlot = await Doctor.findByIdAndUpdate(
      { _id: req.body.doctor_id },
      {
        $set: {
          "availableSlots.$[elem].isBooked": true,
          "availableSlots.$[elem].patientName": currPatient.name,
          "availableSlots.$[elem].appointmentType": "followUp",
        },
      },
      {
        arrayFilters: [
          { "elem._id": new mongoose.Types.ObjectId(req.body.slot_id) },
        ],
        new: true,
      }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message ||
            "Some error occurred while updating doctor's new slots."
        );
      }
    });

    if (!doctorNewSlot) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor new slots."
      );
    }

    const markup = (await Clinic.findOne({})).markupPercentage;

    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const sessionPrice = (
      (doctorNewSlot.hourlyRate / 2) *
      (1 + markup / 100) *
      (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
    ).toFixed(2);

    // create request appointment
    const appointment = await Appointments.create({
      doctor_id: req.body.doctor_id,
      type: "followUp",
      date: req.body.date,
      day: req.body.day,
      slot: req.body.slot,
      patient_id: completedAppointment.patient_id,
      prescription_id: completedAppointment.prescription_id,
      familyMember_nationalId: completedAppointment.familyMember_nationalId,
      status: "requested",
      price: {
        doctor: sessionPrice,
        patient: sessionPrice,
      },
    }).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          { ...req.body, sessionPrice: sessionPrice },
          err.message || "Some error occurred while requesting appointment."
        );
      }
    });

    // add money to doctor's wallet
    const modifyMoney = await Doctor.findByIdAndUpdate(
      req.body.doctor_id,
      {
        walletBalance: doctorNewSlot.walletBalance + Number(sessionPrice),
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          { ...req.body, sessionPrice: sessionPrice },
          err.message ||
            "Some error occurred while adding money to doctor's wallet."
        );
      }
    });

    if (!modifyMoney) {
      return sendResponse(
        500,
        false,
        { ...req.body, sessionPrice: sessionPrice },
        err.message ||
          "Some error occurred while adding money to doctor's wallet."
      );
    }


    if (!appointment) {
      return sendResponse(
        500,
        false,
        { ...req.body, sessionPrice: sessionPrice, doctor: doctorNewSlot },
        err.message || "Some error occurred while requesting appointment."
      );
    }

    return sendResponse(
      200,
      true,
      appointment,
      "Follow-up requested successfully"
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      { ...req.body},
      err.message || "Some error occurred while requesting follow-up."
    );
  }
};

const tempRequestFollowUp = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  // appointment_id: "69fe353h55g3h34hg53h", date: "2022-05-01T00:00:00.000+00:00", day: "2023-4-5", slot: "22:00",
  // slot_id: "69fe353h55g3h34hg53h"}

  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    // get the old appointment
    const completedAppointment = await Appointments.findById(
      req.body.appointment_id
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while retrieving appointment."
        );
      }
    });

    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      String(elem.patient_id) === String(completedAppointment.patient_id);
    })
      ? true
      : false;
    if (
      String(patient._id) !== String(completedAppointment.patient_id) &&
      !isLinked
    ) {
      return sendResponse(
        401,
        false,
        {
          ...req.body,
          pid: patient._id,
          app_p_pid: completedAppointment.patient_id,
        },
        "Unauthorized to request follow-up for this patient"
      );
    }

    // get patient name
    const currPatient = await Patient.findById(
      completedAppointment.patient_id
    ).catch((err) => {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while retrieving patient name."
      );
    });

    // book the new slot
    const doctorNewSlot = await Doctor.findById(
       req.body.doctor_id,
    ).catch((err) => {
      if (err) {
        return sendResponse(
          404,
          false,
          req.body,
          err.message ||
            "Could not find doctor."
        );
      }
    });

    if (!doctorNewSlot) {
      return sendResponse(
        500,
        false,
        req.body,
        err.message || "Some error occurred while updating doctor new slots."
      );
    }

    const markup = (await Clinic.findOne({})).markupPercentage;

    let packageDiscount = 0;
    
    if (patient.healthPackageType.status === "subscribed") {
      const package = await Packages.findOne({
        packageType: patient.healthPackageType.type,
      });

      packageDiscount = package.discountOnSession;

    }  

    const sessionPrice = (
      (doctorNewSlot.hourlyRate / 2) *
      (1 + markup / 100) *
      (1 - (packageDiscount ? packageDiscount / 100.0 : 0))
    ).toFixed(2);

    // create entry in payment transit
    const paymentTransit = await PaymentTransit.create({
      totalPrice: sessionPrice,
      items: [
        {
            name: `Follow-up with ${doctorNewSlot.name} on ${req.body.day} at ${req.body.slot} for ${currPatient.name}` ,
            quantity: 1,
            price: sessionPrice,
        },
      ],
      payload: req.body,
      postURL: `patient/${username}/requestFollowUp`,
    }).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while creating payment entry."
        );
      }
    });

    return sendResponse(
      200,
      true,
      {transit_id: paymentTransit._id},
      "Follow-up requested-transit successful"
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      { ...req.body},
      err.message || "Some error occurred while requesting follow-up transit."
    );
  }
};

const cancelAppointment = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, doctor_id: "69fe353h55g3h34hg53h",
  // appointment_id: "69fe353h55g3h34hg53h"

  let responseSent = false; // Track whether a response has been sent

  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  /* Steps:
    1- auth for cancel
    2- free the slot
    3- cancel the appointment
    4- refund by session price from appointment price if (more than 24 hrs between slot and now)
      add to patient wallet and remove from doc's wallet
  */

  try {
    // AUTH SECTION
    // get the old appointment
    const selectedAppointment = await Appointments.findById(
      req.params.appointment_id
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while retrieving appointment."
        );
      }
    });

    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    if (String(patient._id) !== String(selectedAppointment.patient_id)) {
      return sendResponse(
        401,
        false,
        {
          ...req.params,
          pid: patient._id,
          app_p_pid: selectedAppointment.patient_id,
        },
        "Unauthorized to cancel appointment for this patient"
      );
    }

    // free up the slot
    const doctor = await Doctor.findByIdAndUpdate(
      { _id: req.params.doctor_id },
      {
        $set: {
          "availableSlots.$[elem].isBooked": false,
          "availableSlots.$[elem].patientName": null,
          "availableSlots.$[elem].appointmentType": null,
        },
      },
      {
        arrayFilters: [
          {
            "elem.day": selectedAppointment.day,
            "elem.timeSlot": selectedAppointment.slot,
          },
        ],
        new: true,
      }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.params,
          err.message ||
            "Some error occurred while updating doctor's free slots."
        );
      }
    });

    // cancel the appointment
    const appointment = await Appointments.findByIdAndUpdate(
      { _id: req.params.appointment_id },
      {
        $set: {
          status: "cancelled",
        },
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.params,
          err.message || "Some error occurred while cancelling appointment."
        );
      }
    });

    // check if refund applicable
    const currentDate = new Date();
    if (
      Math.abs(
        currentDate.getTime() - new Date(selectedAppointment.date).getTime()
      ) >=
        24 * 60 * 60 * 1000 &&
      selectedAppointment.status !== "pending"
    ) {
      // remove from doc's wallet using API
      const negBalance = selectedAppointment.price.doctor;
      const modifyMoney = await Doctor.findByIdAndUpdate(
        req.params.doctor_id,
        {
          walletBalance: doctor.walletBalance - negBalance,
        },
        { new: true }
      ).catch((err) => {
        if (err) {
          return sendResponse(
            500,
            false,
            { ...req.params, negBalance, doctorsWallet: doctor.walletBalance },
            err.message ||
              "Some error occurred while refunding from doctor's wallet."
          );
        }
      });

      // add to patient's wallet
      const newBalance =
        patient.walletBalance + selectedAppointment.price.patient;
      let updatedPatient = await Patient.findByIdAndUpdate(
        patient._id,
        {
          walletBalance: newBalance,
        },
        { new: true }
      ).catch((err) => {
        if (err) {
          return sendResponse(
            500,
            false,
            req.params,
            err.message || "Some error occurred while refunding to your wallet."
          );
        }
      });
    } else if (selectedAppointment.status === "pending") {
      // remove from patients amount due
      const negBalance = selectedAppointment.price.patient;
      let updatedPatient = await Patient.findByIdAndUpdate(
        selectedAppointment.patient_id,
        {
          $inc: { amountDue: -1 * negBalance },
        },
        { new: true }
      ).catch((err) => {
        if (err) {
          return sendResponse(
            500,
            false,
            req.params,
            err.message || "Some error occurred while refunding to your wallet."
          );
        }
      });
    }

    return sendResponse(
      200,
      true,
      req.params,
      "Appointment cancelled successfully."
    );
  } catch (err) {
    return sendResponse(
      500,
      false,
      req.params,
      err.message || "Cancel Request failed."
    );
  }
};

const createDoc = async (req, res) => {
  //TESTING PURPOSES
  const rest = await Doctor.create({
    username: "NewDoc1423",
    name: "NewDoc1",
    email: "NewDoc2324@gmail.com",
    password: "123",
    dateOfBirth: "2023-10-05T21:00:00.000Z",
    hourlyRate: 13,
    affiliatedHospital: "Dar el Skill issue",
    educationalBackground: "GUC - Surgery",
    contracts: [],
    patientList: [
      {
        patient_id: "651fe76c2bbcb5711192f24f",
      },
      {
        patient_id: "651fe7a92bbcb5711192f258",
      },
      {
        patient_id: "651fe96d145ccbfc3bde95f3",
      },
      {
        patient_id: "651fe981145ccbfc3bde95f6",
      },
      {
        patient_id: "651fe991145ccbfc3bde95f9",
      },
    ],
    availableSlots: [
      {
        starttime: "2021-05-01T00:00:00.000+00:00",
        endtime: "2021-05-01T06:00:00.000+00:00",
      },
    ],
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while creating doctor.",
    });
  });
};

const linkFamMember = async (req, res) => {
  //find the fam member account from the unique email or phone number (find out which one was provided)
  //if not found return error
  //if found add link to the patient account (in both accounts)

  const { emailOrPhone, relation } = req.body;
  const { username } = req.params;

  //find the account of the family member
  const famMember = await Patient.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving patient.",
    });
  });

  if (!famMember) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Family member account not found",
    });
  }

  const famMember_id = famMember._id;

  //get the original patient
  const patient = await getPatient(username);

  // let found = false;
  // if (!patient.extfamilyMembers) {
  //   patient.extfamilyMembers = [];
  // }

  if (!patient.linkedAccounts) {
    patient.linkedAccounts = [];
  }

  if (!famMember.linkedAccounts) {
    famMember.linkedAccounts = [];
  }

  // if (!famMember.extfamilyMembers) {
  //   famMember.extfamilyMembers = [];
  // }

  //check if family member found is not already in extFamilyMembers array, if not in array then add
  // for (const familyMember of patient.extfamilyMembers) {
  //   if (famMember.name === familyMember.name) {
  //     found = true;
  //     break;
  //   }
  // }

  // if (!found) {
  //   //add new family member info to patient's extfamilyMembers array
  //   patient.extfamilyMembers.push({
  //     name: famMember.name,
  //     relation: relation, //wife, husband, son, daughter
  //     age: famMember.age,
  //     gender: famMember.gender, //M, F, Bahy
  //     healthPackageType: patient.healthPackageType,
  //   });
  // }

  let newRel = "";

  if (relation === "wife") {
    newRel = "husband";
  } else if (relation === "husband") {
    newRel = "wife";
  } else if (relation === "son" || relation === "daughter") {
    if (patient.gender === "M") {
      newRel = "father";
    } else {
      newRel = "mother";
    }
  }

  // famMember.extfamilyMembers.push({
  //   name: patient.name,
  //   relation: newRel, //wife, husband, father, mother
  //   age: patient.age,
  //   gender: patient.gender, //M, F, Bahy
  //   healthPackageType: patient.healthPackageType,
  // });

  //add to linked accounts array in both accounts
  patient.linkedAccounts.push({
    patient_id: famMember_id,
    relation: relation,
  });
  famMember.linkedAccounts.push({ patient_id: patient._id, relation: newRel });

  //update the existing patient
  await Patient.findByIdAndUpdate(patient._id, {
    //extfamilyMembers: patient.extfamilyMembers,
    linkedAccounts: patient.linkedAccounts,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while updating patient.",
    });
  });

  //update the existing family member
  await Patient.findByIdAndUpdate(famMember_id, {
    linkedAccounts: famMember.linkedAccounts,
    //extfamilyMembers: famMember.extfamilyMembers,
    healthPackageType: patient.healthPackageType,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message ||
        "Some error occurred while updating family member account.",
    });
  });

  const newPatient = await Patient.findById(patient._id).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving patient.",
    });
  });

  return res.status(200).json({
    success: true,
    data: newPatient,
    message: "Family member account linked successfully",
  });
};

const cancelHealthPackage = async (req, res) => {
  //find the fam member account from the unique email or phone number (find out which one was provided)
  //if not found return error
  //if found add link to the patient account (in both accounts)

  const { username } = req.params;

  const patient = await getPatient(username);

  if (!patient) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Patient account not found",
    });
  }

  if (!patient.extfamilyMembers) {
    patient.extfamilyMembers = [];
  }

  //change package status to cancelled and set the end date to be the renewal date
  //do same for all family members
  patient.healthPackageType.status = "cancelled";
  patient.healthPackageType.endDate = patient.healthPackageType.renewal;

  for (const famMember of patient.extfamilyMembers) {
    //famMember.healthPackageType.type = patient.healthPackageType.type;
    famMember.healthPackageType.status = "cancelled";
    famMember.healthPackageType.endDate = patient.healthPackageType.renewal;
  }

  if (!patient.linkedAccounts) {
    patient.linkedAccounts = [];
  }

  //TODO: also check linked accounts and cancel their health packages
  for (const linkedAccount of patient.linkedAccounts) {
    const linkedPatient = await Patient.findById(linkedAccount.patient_id);
    linkedPatient.healthPackageType.status = "cancelled";
    linkedPatient.healthPackageType.endDate = patient.healthPackageType.renewal;
    //linkedPatient.healthPackageType.type = patient.healthPackageType.type;

    await Patient.findByIdAndUpdate(linkedPatient._id, {
      healthPackageType: linkedPatient.healthPackageType,
    }).catch((err) => {
      return res.status(500).json({
        success: false,
        data: null,
        message:
          err.message ||
          "Some error occurred while updating linked patient account.",
      });
    });
  }

  //update the existing patient
  await Patient.findByIdAndUpdate(patient._id, {
    healthPackageType: patient.healthPackageType,
    extfamilyMembers: patient.extfamilyMembers,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while updating patient.",
    });
  });

  const newPatient = await Patient.findById(patient._id).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving patient.",
    });
  });

  return res.status(200).json({
    success: true,
    data: newPatient,
    message: "Health package cancelled successfully",
  });
};

const tempSub = async (req, res) => {
  const data = req.body;
  const { username } = req.params;

  const patient = await getPatient(username);
  // patient.healthPackageType.status = "subscribed";
  // patient.healthPackageType.type = data.healthPackage;
  // patient.healthPackageType.renewal = data.renewal;

  if (!patient.extfamilyMembers) {
    patient.extfamilyMembers = [];
  }

  if (!patient.linkedAccounts) {
    patient.linkedAccounts = [];
  }

  let famLen = patient.extfamilyMembers.length;
  let linkedLen = patient.linkedAccounts.length;

  //I will redirect to the payment page here after I return something
  //TODO: modify price and quantity so that it is multiplied by number of fam members

  //TODO: redirections
  //res.redirect(307, "/patient/subscribe");

  try {
    const payment = await PaymentTransit.create({
      totalPrice: data.price * (famLen + linkedLen + 1),
      items: [
        {
          name:
            data.healthPackage +
            " Health Package Subscription" +
            " (Renewal: " +
            data.renewal +
            ")",
          quantity: famLen + linkedLen + 1,
          price: data.price * (famLen + linkedLen + 1),
        },
      ],
      payload: {
        username: data.username,
        healthPackage: data.healthPackage,
        renewal: data.renewal,
      },
      postURL: `patient/${username}/subscriptions/subscribe`,
    }).catch((err) => {
      return res.status(500).json({
        success: false,
        data: null,
        message:
          err.message || "Some error occurred while creating payment transit.",
      });
    });

    return res.status(200).json({
      success: true,
      data: payment,
      message: "Data sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Some error occurred while performing request",
    });
  }
};

const actualSub = async (req, res) => {
  const data = req.body;
  const { username } = req.params;

  const patient = await getPatient(username);
  patient.healthPackageType.status = "subscribed";
  patient.healthPackageType.type = data.healthPackage;
  patient.healthPackageType.renewal = data.renewal;

  if (!patient.extfamilyMembers) {
    patient.extfamilyMembers = [];
  }

  if (!patient.linkedAccounts) {
    patient.linkedAccounts = [];
  }

  for (const famMember of patient.extfamilyMembers) {
    //if (data.familyMembers.includes(famMember.name)) {
    famMember.healthPackageType.status = "subscribed";
    famMember.healthPackageType.type = data.healthPackage;
    famMember.healthPackageType.renewal = data.renewal;
    //}
  }

  for (const linkedAccount of patient.linkedAccounts) {
    const linkedPatient = await Patient.findById(linkedAccount.patient_id);
    linkedPatient.healthPackageType.status = "subscribed";
    linkedPatient.healthPackageType.type = data.healthPackage;
    linkedPatient.healthPackageType.renewal = data.renewal;

    await Patient.findByIdAndUpdate(linkedPatient._id, {
      healthPackageType: linkedPatient.healthPackageType,
    }).catch((err) => {
      return res.status(500).json({
        success: false,
        data: null,
        message:
          err.message ||
          "Some error occurred while updating linked patient account.",
      });
    });
  }

  //update the existing patient
  await Patient.findByIdAndUpdate(patient._id, {
    healthPackageType: patient.healthPackageType,
    extfamilyMembers: patient.extfamilyMembers,
  }).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while updating patient.",
    });
  });

  const newPatient = await Patient.findById(patient._id).catch((err) => {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving patient.",
    });
  });

  return res.status(200).json({
    success: true,
    data: newPatient,
    message: "Health package subscription successful",
  });
};

const getPatientemUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });

    if (patient) {
      return res.status(200).json({
        success: true,
        data: { email: patient.email },
        message: "Patient email retrieved successfully",
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
        error.message || "Some error occurred while retrieving patient email.",
    });
  }
};

const AddHealthRecord = async (req, res) => {
  // Extract other health record properties from the request body

  const documentType = req.nameFile;
  const documentName = req.nameFile;
  // other health record properties...

  // Use Multer to handle the file upload

  let documentUrl = "http://localhost:8000/documents/" + req.nameFile;
  console.log("Username:", req.params.username);

  try {
    // Fetch existing health records
    const patient = await Patient.findOne({ username: req.params.username });

    if (!patient) {
      console.log("Patient not found:", req.params.username);

      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    /* const existingHealthRecords = patient.healthRecords || [];

      // Log the existing health records before adding the new record
      console.log('Existing Health Records:', existingHealthRecords);

      // Add the new health record to the array
      const updatedHealthRecords = [...existingHealthRecords, { documentType, documentName, documentUrl }];

      // Log the updated health records before updating in the database
      console.log('Updated Health Records:', updatedHealthRecords);*/
    patient.healthRecords.push({ documentType, documentName, documentUrl });
    // Update the health records in the database
    /*const updatedPatient = await Patient.findOneAndUpdate(
        { username: req.params.username },
        patient.healthRecords,
        { new: true }
      );*/
    const updatedPatient = await patient.save();

    res.status(201).json({
      success: true,
      message: "Health record created successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

const getAllHealthRecords = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    const healthRecords = patient.healthRecords;

    res.status(200).json({
      success: true,
      message: "Health records retrieved successfully",
      data: healthRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

const removeHealthRecord = async (req, res) => {
  const recordId = req.params.recordId;

  try {
    const patient = await Patient.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: {
          healthRecords: { _id: recordId },
        },
      },
      { new: true }
    );

    if (patient) {
      res.status(200).json({
        success: true,
        message: "Health record removed successfully",
        data: patient,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

const getTransitData = async (req, res) => {

  let responseSent = false; // Track whether a response has been sent
  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };



  try {
    const tid = req.params.transit_id;
    const payment = await PaymentTransit.findById(tid).catch((err) => {
      return sendResponse(
        500,
        false,
        req.params,
        err.message || "Some error occurred while retrieving payment transit."
      );
    
    });

    return sendResponse(
      200,
      true,
      payment,
      "Data sent successfully"
    );


  } catch (error) {
    return sendResponse(
      500,
      false,
      req.params,
      error.message || "Some error occurred while performing request"
    );
    
  }
};

const payDoctorScheduledFollowUp = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: self_username, { doctor_id: "69fe353h55g3h34hg53h",
  // appointment_id: "69fe353h55g3h34hg53h"},

  let responseSent = false; // Track whether a response has been sent
  const sendResponse = (statusCode, success, data, message) => {
    if (!responseSent) {
      responseSent = true;
      return res.status(statusCode).json({ success: success, data, message });
    }
  };

  try {
    const selectedAppointment = await Appointments.findById(
      req.body.appointment_id
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while retrieving appointment."
        );
      }
    });

    // auth check
    const username = req.params.username;
    const patient = await getPatient(username);
    let isLinked = patient.linkedAccounts.find((elem) => {
      String(elem.patient_id) === String(selectedAppointment.patient_id);
    })
      ? true
      : false;
    if (
      String(patient._id) !== String(selectedAppointment.patient_id) &&
      !isLinked
    ) {
      return sendResponse(
        401,
        false,
        {
          ...req.body,
          pid: patient._id,
          app_p_pid: selectedAppointment.patient_id,
        },
        "Unauthorized to pay for this patient"
      );
    }

    // remove from patients due (from wallet handled by payment page)
    const amountDue = patient.amountDue - selectedAppointment.price.patient;
    let updatedPatient = await Patient.findByIdAndUpdate(
      patient._id,
      {
        amountDue: amountDue,
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while paying from your wallet."
        );
      }
    });

    // add to doc's wallet
    const modifyMoney = await Doctor.findByIdAndUpdate(
      selectedAppointment.doctor_id,
      {
        $inc: { walletBalance: selectedAppointment.price.doctor },
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while paying to doctor's wallet."
        );
      }
    });

    // set appointment to upcoming
    const editedAppointment = await Appointments.findByIdAndUpdate(
      selectedAppointment._id,
      {
        status: "upcoming",
      },
      { new: true }
    ).catch((err) => {
      if (err) {
        return sendResponse(
          500,
          false,
          req.body,
          err.message || "Some error occurred while mofidying appointment."
        );
      }
    });

    return sendResponse(
      200,
      true,
      editedAppointment,
      "Payment successful"
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Some error occurred while performing request",
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
  viewAllDoctorsAvailable,
  createDoc,
  getPatientAPI,
  getPatientAPIByID,
  editWalletBalance,
  linkFamMember,
  getAllFreeDocAppointments,
  cancelHealthPackage,
  tempSub,
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
  getTransitData,
  payDoctorScheduledFollowUp,
  tempBookAppointment,
  tempRequestFollowUp,
};
