const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointments = require("../models/Appointments");
const fs = require("fs");
const numberToWords = require("number-to-words");
const Prescription = require("../models/Prescription");
const Clinic = require("../models/Clinic");
const Packages = require("../models/Packages");

const getDoctor = async (req, res) => {
  //console.log("I am here");
  const { username } = req.params;
  // console.log("The Username", username);
  const doctor = await Doctor.findOne({ username }).catch((err) => {
    const send = {
      success: false,
      data: null,
      message: `${err.message}`,
    };
    res.status(500).json(send);
    return;
  });
  if (!doctor) {
    const send = {
      success: false,
      data: null,
      message: "Doctor not found1",
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
      var healthRecords = null;
      var patientName = "";
      if (appointment.familyMember_nationalId === null) {
        patientName = patient.name;
        healthRecords = patient.healthRecords;
      } else {
        const family = patient.extfamilyMembers;

        family.forEach((member) => {
          if (member.national_id === appointment.familyMember_nationalId) {
            patientName = member.name;
          }
        });
      }

      i++;
      //const appointmentDate = new Date(appointment.date).toLocaleDateString();
      const appointmentDate = new Date(appointment.date).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }
      );
      const appointmentInfo = {
        _id: patient._id,
        appID: appointment._id,
        PUN: patient.username,
        id: i,
        date: appointmentDate,
        time: appointment.slot,
        status: appointment.status,
        name: patientName,
        gender: patient.gender,
        age: patient.age,
        type: appointment.type,
        mobileNumber: patient.mobileNumber,
        healthRecords: healthRecords,
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

const createAppointments = async (req, res) => {
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

const createAppointment = async (req, res) => {
  const patientUsername = "bahyfive";
  const patient = await Patient.findOne({ username: patientUsername });
  const patientId = patient._id;
  const doctorUsername = "opa nseet esmy";
  const doctor = await Doctor.findOne({ username: doctorUsername });
  const doctorId = doctor._id;
  const appoinment = await Appointments.create({
    doctor_id: doctorId,
    type: "appointment",
    date: "2019-06-29",
    time: 1,
    patient_id: patientId,
    prescription_id: null,
    status: "completed",
  });
  const send = {
    success: true,
    data: appoinment,
    message: "Appointment created successfully",
  };
  res.status(200).json(send);
};

const approveDoctor = async (req, res) => {
  try {
    const { username } = req.params;
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        adminApproval: true,
      },
      { new: true }
    );
    const send = {
      success: true,
      data: doctor,
      message: "Doctor approved successfully",
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

const addMoney = async (req, res) => {
  try {
    const { username } = req.params;
    const { amount } = req.body;
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    const newWalletBalance = doctor.walletBalance + amount;
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        walletBalance: newWalletBalance,
      },
      { new: true }
    );
    const send = {
      success: true,
      data: doctor,
      message: "Money added successfully",
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

const acceptContract = async (req, res) => {
  try {
    //console.log("I am here");
    const { username } = req.params;
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    // console.log(doctorId);
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        contractAccepted: true,
      },
      { new: true }
    );
    const send = {
      success: true,
      data: doctor,
      message: "Doctor accepted successfully",
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

const addSlot = async (req, res) => {
  try {
    const { username } = req.params;
    const { day, timeSlot } = req.body;
    var doctor = await Doctor.findOne({ username });
    // console.log(timeSlot);
    const doctorId = doctor._id;
    //console.log(timeSlot); // prints 13:00
    let dayComponents = day.split("-");
    let timeComponents = timeSlot.split(":");

    let year = parseInt(dayComponents[0]);
    let month = parseInt(dayComponents[1]) - 1; // JavaScript months are 0-indexed
    let dayOfMonth = parseInt(dayComponents[2]);

    let hours = parseInt(timeComponents[0]);
    let minutes = parseInt(timeComponents[1]);

    let startTime = new Date(Date.UTC(year, month, dayOfMonth, hours, minutes));
    // console.log(startTime);

    let endTime = new Date(Date.UTC(year, month, dayOfMonth, hours, minutes));

    // Get the minutes from the Date object
    minutes = endTime.getMinutes();

    // Add 30 to the minutes
    minutes += 30;

    // Set the new minutes to the Date object
    endTime.setMinutes(minutes);
    //  startTime.setHours(startTime.getHours() + 2);
    // endTime.setHours(endTime.getHours() + 2);
    // console.log(startTime);
    // console.log(endTime);
    const isBooked = false;
    const patientName = "";
    const appointmentType = "";
    const newSlot = {
      day,
      timeSlot,
      startTime,
      endTime,
      isBooked,
      patientName,
      appointmentType,
    };
    doctor = await Doctor.findById({ _id: doctorId });
    const slots = doctor.availableSlots;
    var flag = false;
    slots.forEach((slot) => {
      if (slot.day === day && slot.timeSlot === timeSlot) {
        flag = true;
      }
    });
    if (flag) {
      throw new Error("Slot already exists");
    }
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $push: { availableSlots: newSlot },
      },
      { new: true }
    );
    const send = {
      success: true,
      data: doctor,
      message: "Slot added successfully",
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

const getSchedule = async (req, res) => {
  try {
    const { username } = req.params;
    const { day } = req.body;
    //console.log(day);
    const doctor = await Doctor.findOne({ username });
    const slots = doctor.availableSlots;
    const result = [];
    slots.forEach((slot) => {
      if (slot.day === day) {
        result.push(slot);
      }
    });
    result.sort((a, b) => {
      return a.startTime - b.startTime;
    });
    const send = {
      success: true,
      data: result,
      message: "Schedule found successfully",
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

const addAppointment = async (req, res) => {
  try {
    const { username } = req.params;
    const { day, timeSlot, startTime, type, patientId, appID } = req.body;
    var patient = await Patient.findById({ _id: patientId });
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    var patientName = null;
    // console.log("My name is :", patientName);
    var appointment = await Appointments.findById({ _id: appID });
    const familyMember_nationalId = appointment.familyMember_nationalId;
    if (familyMember_nationalId === null) {
      patientName = patient.name;
    } else {
      const family = patient.extfamilyMembers;
      family.forEach((member) => {
        if (member.national_id === familyMember_nationalId) {
          patientName = member.name;
        }
      });
    }
    const prescriptionId = appointment.prescription_id;
    const followUp = await Appointments.create({
      doctor_id: doctorId,
      type,
      date: startTime,
      day,
      slot: timeSlot,
      patient_id: patientId,
      prescription_id: prescriptionId,
      familyMember_nationalId,
      status: "upcoming",
    });
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $set: {
          "availableSlots.$[elem].isBooked": true,
          "availableSlots.$[elem].patientName": patientName,
          "availableSlots.$[elem].appointmentType": type,
        },
      },
      {
        arrayFilters: [{ "elem.day": day, "elem.timeSlot": timeSlot }],
        new: true,
      }
    );
    const markup = (await Clinic.findOne({})).markupPercentage;
    // console.log("The markup is :", markup);
    var discount = 0;
    if (patient.healthPackageType.status === "subscribed") {
      discount = (
        await Packages.findOne({ type: patient.healthPackageType.type })
      ).discountOnSession;
    }
    // console.log("The discount is :", discount);
    const sessionPrice = (
      (doctor.hourlyRate / 2) *
      (1 + markup / 100) *
      (1 - discount)
    ).toFixed(2);
    // console.log("The session price is :", sessionPrice);
    patient = await Patient.findByIdAndUpdate(
      { _id: patientId },
      {
        $inc: { amountDue: sessionPrice  },
      },
      { new: true }
    );

    const data = {
      name: patientName,
      followUp,
    };
    const send = {
      success: true,
      data,
      message: `${type} scheduled successfully for ${patientName}`,
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

const getMarkup = async (req, res) => {
  try {
    // console.log("I am here");
    const { username } = req.params;
    const doctor = await Doctor.findOne({ username });
    const markup = (await Clinic.findOne({})).markupPercentage;
    const hourlyRate = doctor.hourlyRate;
    const totalPrice = (hourlyRate * (1 + markup / 100)).toFixed(2);
    // console.log("The markup is :", markup);
    const data = {
      markup,
      hourlyRate,
      totalPrice,
    };
    const send = {
      success: true,
      data: data,
      message: "Markup found successfully",
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

module.exports = {
  getDoctor,
  createDoctor,
  updateDoctor,
  getAppointments,
  createPatient,
  createAppointment,
  getPatients,
  saveFile,
  createAppointments,
  approveDoctor,
  addMoney,
  acceptContract,
  addSlot,
  getSchedule,
  addAppointment,
  getMarkup,
};
