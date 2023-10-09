const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointments = require("../models/Appointments");
const fs = require("fs");
const numberToWords = require("number-to-words");
const Prescription = require("../models/Prescription");

const getDoctor = async (req, res) => {
  // console.log("I am here");
  const { username } = req.params;
  // console.log(username);
  const doctor = await Doctor.find({ username }).catch((err) => {
    const send = {
      success: false,
      data: null,
      message: `${err.message}`,
    };
    res.status(500).json(send);
    return;
  });
  if (doctor.length === 0) {
    const send = {
      success: false,
      data: null,
      message: "Doctor not found",
    };
    res.status(404).json(send);
    return;
  }
  const send = {
    success: true,
    data: doctor,
    message: "Doctor found successfully",
  };
  res.status(200).json(send);
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
    const send = {
      success: true,
      data: doctor,
      message: "Doctor created successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
    return;
  }
};

const updateDoctor = async (req, res) => {
  const { username } = req.params;
  try {
    const oldDoctor = await Doctor.findOne({ username });
    var { hourlyRate, email, affiliatedHospital } = req.body;
    // console.log(hourlyRate, email, affiliatedHospital);
    const newDoctor = await Doctor.findByIdAndUpdate(
      { _id: oldDoctor._id },
      {
        email,
        hourlyRate,
        affiliatedHospital,
      },
      { new: true }
    );
    // console.log(newDoctor);
    if (!newDoctor) {
      const send = {
        success: false,
        data: null,
        message: "Doctor not found",
      };
      res.status(404).json(send);
      return;
    }
    const send = {
      success: true,
      data: newDoctor,
      message: "Doctor updated successfully",
    };
    // console.log(doctor);
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: "Email already exists",
    };
    res.status(500).json(send);
  }
};

const getAppointments = async (req, res) => {
  try {
    const { username } = req.params;
    const result = [];

    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const doctorId = doctor._id;
    const appointments = await Appointments.find({ doctor_id: doctorId });
    var i = 0;
    for (const appointment of appointments) {
      const patientId = appointment.patient_id;
      const patient = await Patient.findById({ _id: patientId });
      const patientName = patient.name;
      i++;
      const appointmentDate = new Date(appointment.date).toLocaleDateString();
      const appointmentInfo = {
        id: i,
        date: appointmentDate,
        status: appointment.status,
        name: patientName,
        gender: patient.gender,
        age: patient.age,
        type: appointment.type,
        mobileNumber: patient.mobileNumber,
        healthRecords: patient.healthRecords,
      };
      result.push(appointmentInfo);
    }

    const send = {
      success: true,
      data: result,
      message: "Appointments found successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
  }
};

const createPatient = async (req, res) => {
  // console.log(req.body);
  try {
    var {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
      creditCards,
      healthPackageType,
    } = req.body;
    const patients = [];
    for (var i = 1; i < 6; i++) {
      const addition = numberToWords.toWords(i);
      const newUsername = `${username}${addition}`;
      const newEmail = `${addition}${email}`;
      const newName = `${name}${addition}`;
      const records = [];
      // const pdf = fs.readFileSync("DoctorStaticData/test.pdf");
      const healthRecord = {
        documentType: "pdf",
        documentName: "test",
        documentUrl: "DoctorStaticData/test.pdf",
      };
      records.push(healthRecord);
      const pres = await Prescription.create({
        PharmacySubmitStatus: false,
        isFilled: false,
      });
      const id = pres._id;
      const prescriptions = [
        {
          prescription_id: id,
        },
      ];
      const patient = await Patient.create({
        username: newUsername,
        name: newName,
        email: newEmail,
        password,
        dateOfBirth,
        gender,
        mobileNumber,
        emergencyContact,
        creditCards,
        healthPackageType,
        healthRecords: records,
        perscreption_ids: prescriptions,
      });
      if (!patient) {
        throw new Error("Patient not created");
      }
      patients.push(patient);
    }

    const send = {
      success: true,
      data: patients,
      message: "Patient created successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
    return;
  }
};

const createAppointment = async (req, res) => {
  const doctor = await Doctor.findOne({ username: "opa nseet esmy" });
  const doctorId = doctor._id;
  const apps = [];
  try {
    const patients = await Patient.find({});

    patients.forEach(async (patient) => {
      if (patient.username.includes("bahy")) {
        const patientId = patient._id;
        doctor.patientList.push({ patient_id: patientId });
        await Doctor.findByIdAndUpdate(
          { _id: doctorId },
          {
            patientList: doctor.patientList,
          },
          { new: true }
        );
        const types = ["followUp", "appointment"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const status = ["upcoming", "completed", "cancelled", "rescheduled"];
        const randomStatus = status[Math.floor(Math.random() * status.length)];
        const appointment = await Appointments.create({
          doctor_id: doctorId,
          type: randomType,
          date: "2021-05-01",
          time: 1,
          patient_id: patientId,
          prescription_id: null,
          status: randomStatus,
        });
        apps.push(appointment);
      }
    });
    const send = {
      success: true,
      data: apps,
      message: "Appointments created successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
    return;
  }
};

const getPatients = async (req, res) => {
  try {
    const { username } = req.params;
    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const doctorId = doctor._id;
    const patients = await Patient.find({});
    const result = [];
    var i = 0;
    for (const patient of patients) {
      const patientId = patient._id;
      const patientName = patient.name;
      var isWithMe = false;
      const upcoming = [];
      for (const client of doctor.patientList) {
        if (client.patient_id.toString() === patientId.toString()) {
          isWithMe = true;
          const appointments = await Appointments.find({
            patient_id: patientId,
            doctor_id: doctorId,
          });
          appointments.forEach((appointment) => {
            upcoming.push(appointment.status);
          });
        }
      }
      i++;
      const patientInfo = {
        name: patientName,
        isWithMe,
        upcoming,
        index: i,
      };
      result.push(patientInfo);
    }

    const send = {
      success: true,
      data: result,
      message: "Patients found successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
  }
};

const saveFile = async (req, res) => {
  const pdf = fs.readFileSync("../../DoctorStaticData/test.pdf");
};

module.exports = {
  getDoctor,
  createDoctor,
  updateDoctor,
  getAppointments,
  createPatient,
  createAppointment,
  getPatients,
  saveFile,
};
