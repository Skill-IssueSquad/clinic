const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointments = require("../models/Appointments");
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
  const idDoctor = await Doctor.findOne({ username });
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      { _id: idDoctor._id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!doctor) {
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
      message: "Doctor updated successfully",
    };
    // console.log(doctor);
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

const getAppointments = async (req, res) => {
  const { username } = req.params;
  const result = [];
  try {
    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const doctorId = doctor._id;
    const appointments = await Appointments.find({ doctor_id: doctorId });

    for (const appointment of appointments) {
      const patientId = appointment.patient_id;
      const patient = await Patient.findById({ _id: patientId });
      const patientName = patient.name;
      const appointmentInfo = {
        date: appointment.date,
        status: appointment.status,
        name: patientName,
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
    const {
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
    const patient = await Patient.create({
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
    });
    if (!patient) {
      throw new Error("Patient not created");
    }
    const send = {
      success: true,
      data: patient,
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
  try {
    const patients = await Patient.find({});

    patients.forEach(async (patient) => {
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
    });
    const send = {
      success: true,
      data: patients,
      message: "Appointment created successfully",
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

module.exports = {
  getDoctor,
  createDoctor,
  updateDoctor,
  getAppointments,
  createPatient,
  createAppointment,
};
