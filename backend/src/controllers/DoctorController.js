const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointments = require("../models/Appointments");
const fs = require("fs");
const numberToWords = require("number-to-words");
const Prescription = require("../models/Prescription");
const Clinic = require("../models/Clinic");
const Packages = require("../models/Packages");
const nodeMailer=require("nodemailer");


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
      if (appointment.status === "requested") {
        continue;
      }
      const patientId = appointment.patient_id;
      const patient = await Patient.findById({ _id: patientId });
      var healthRecords = null;
      var patientName = "";
      if (
        appointment.familyMember_nationalId === null ||
        appointment.familyMember_nationalId === ""
      ) {
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
      const appointmentDate = new Date(appointment.date).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }
      );
      const uniqueName = `${patientName}(${patient.username})`;
      const appointmentInfo = {
        _id: patient._id,
        appID: appointment._id,
        PUN: patient.username,
        id: i,
        date: appointmentDate,
        time: appointment.slot,
        status: appointment.status,
        name: uniqueName,
        gender: patient.gender,
        age: patient.age,
        type: appointment.type,
        mobileNumber: patient.mobileNumber,
        healthRecords: healthRecords,
        prescription_id: appointment.prescription_id,
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
    const { day, timeSlot, startTime, type, patientId, appID, isFollowUp } =
      req.body;
    var patient = await Patient.findById({ _id: patientId });
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    var patientName = null;
    // console.log("My name is :", patientName);
    var appointment = await Appointments.findById({ _id: appID });
    const oldSlot = appointment.slot;
    const oldDay = appointment.day;
    if (!isFollowUp) {
      appointment = await Appointments.findByIdAndUpdate(
        { _id: appID },
        {
          status: "rescheduled",
        },
        { new: true }
      );
      doctor = await Doctor.findByIdAndUpdate(
        { _id: doctorId },
        {
          $set: {
            "availableSlots.$[elem].isBooked": false,
            "availableSlots.$[elem].patientName": "",
            "availableSlots.$[elem].appointmentType": "",
          },
        },
        {
          arrayFilters: [
            { "elem.day": appointment.day, "elem.timeSlot": appointment.slot },
          ],
          new: true,
        }
      );
    }
    const familyMember_nationalId = appointment.familyMember_nationalId;
    if (familyMember_nationalId === null || familyMember_nationalId === "") {
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
    var price = {
      doctor: appointment.price.doctor,
      patient: appointment.price.patient,
    };

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
    if (isFollowUp) {
      const markup = (await Clinic.findOne({})).markupPercentage;
      var discount = 0;
      if (patient.healthPackageType.status === "subscribed") {
        discount = (
          await Packages.findOne({
            packageType: patient.healthPackageType.type,
          })
        ).discountOnSession;
      }
      const sessionPrice = (
        (doctor.hourlyRate / 2) *
        (1 + markup / 100) *
        (1 - discount / 100)
      ).toFixed(2);
      patient = await Patient.findByIdAndUpdate(
        { _id: patientId },
        {
          $inc: { amountDue: sessionPrice },
        },
        { new: true }
      );
      price.doctor = sessionPrice;
      price.patient = sessionPrice;
    }
    var statusAppointment = isFollowUp ? "pending" : "upcoming";

    const followUp = await Appointments.create({
      doctor_id: doctorId,
      type,
      date: startTime,
      day,
      slot: timeSlot,
      patient_id: patientId,
      prescription_id: prescriptionId,
      familyMember_nationalId,
      status: statusAppointment,
      price,
    });
    const data = {
      name: patientName,
      followUp,
      type,
      oldSlot,
      oldDay,
    };
    const send = {
      success: true,
      data,
      message: `${type} ${
        isFollowUp ? "scheduled" : "rescheduled"
      } successfully for ${patientName} . Redirecting to appointments page`,
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

const cancelAppointment = async (req, res) => {
  try {
    const { username } = req.params;
    const { appID } = req.body;
    console.log(appID);
    var appointment = await Appointments.findByIdAndUpdate(
      { _id: appID },
      {
        status: "cancelled",
      },
      { new: true }
    );
    const priceDoc = appointment.price.doctor;
    const pricePat = appointment.price.patient;
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    var slots = doctor.availableSlots;
    slots.forEach((slot) => {
      if (slot.day === appointment.day && slot.timeSlot === appointment.slot) {
        slot.isBooked = false;
        slot.patientName = "";
        slot.appointmentType = "";
      }
    });
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $set: {
          "availableSlots.$[elem].isBooked": false,
          "availableSlots.$[elem].patientName": "",
          "availableSlots.$[elem].appointmentType": "",
        },
      },
      {
        arrayFilters: [
          { "elem.day": appointment.day, "elem.timeSlot": appointment.slot },
        ],
        new: true,
      }
    );
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $dec: { walletBalance: priceDoc },
      },
      { new: true }
    );
    const patientId = appointment.patient_id;
    var patient = await Patient.findByIdAndUpdate(
      { _id: patientId },
      {
        $inc: { walletBalance: pricePat },
      },
      { new: true }
    );
    const Equate = fetch(`http://localhost:8001/balance/${patient.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        balance: patient.walletBalance,
      }),
    });
    const send = {
      success: true,
      data: appointment,
      message: "Appointment cancelled successfully",
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

const addToPrescription = async (req, res) => {
  try {
    const { appID, medicineName, dose, medicineID } = req.body;
    var message = "";
    var appointment = await Appointments.findById({ _id: appID });
    var id = appointment.prescription_id;
    if (id === null || id === "" || id === undefined) {
      const prescription = await Prescription.create({
        PharmacySubmitStatus: false,
        isFilled: false,
        medicines: [
          {
            medicineName,
            dose,
            medicineID,
          },
        ],
      });
      id = prescription._id;
      const patient = await Patient.findById({ _id: appointment.patient_id });
      patient.perscreption_ids.push({ prescription_id: id });
      patient.save();
      appointment = await Appointments.findByIdAndUpdate(
        { _id: appID },
        {
          prescription_id: id,
        },
        { new: true }
      );
      const send = {
        success: true,
        data: appointment,
        message: `Prescription created successfully and ${medicineName} added`,
      };
      res.status(200).json(send);
      return;
    } else {
      const prescription = await Prescription.findById({ _id: id });
      const medicine = {
        medicineName,
        dose,
        medicineID,
      };
      prescription.medicines.forEach((med) => {
        if (med.medicineID === medicineID) {
          message = `${medicineName} dose updated successfully`;
          med.dose = dose;
        }
      });
      if (message === "") {
        message = `${medicineName} added successfully`;
        prescription.medicines.push(medicine);
      }
      prescription.save();
      const send = {
        success: true,
        data: prescription,
        message,
      };
      res.status(200).json(send);
      return;
    }
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
  }
};

const getMedicinesStatus = async (req, res) => {
  try {
    const { appID } = req.body;
    const appointment = await Appointments.findById({ _id: appID });
    const prescriptionId = appointment.prescription_id;
    if (
      prescriptionId === null ||
      prescriptionId === "" ||
      prescriptionId === undefined
    ) {
      const send = {
        success: true,
        data: null,
        message: "No prescription found",
      };
      const Data = {
        data: send,
        additionalMedicines: "",
      };
      res.status(200).json(Data);
      return;
    }
    const prescription = await Prescription.findById({ _id: prescriptionId });
    const medicines = prescription.medicines;
    var additionalMedicines = prescription.additionalMedicines;
    if (additionalMedicines === null || additionalMedicines === undefined) {
      additionalMedicines = "";
    }
    // console.log(medicines);
    const send = {
      success: true,
      data: medicines,
      message: "Medicines status retrieved successfully",
    };
    const Data = {
      data: send,
      additionalMedicines,
    };
    res.status(200).json(Data);
    return;
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    const Data = {
      data: send,
      additionalMedicines: "",
    };
    res.status(500).json(Data);
  }
};

const removeFromPrescription = async (req, res) => {
  try {
    const { appID, medicineID } = req.body;
    var appointment = await Appointments.findById({ _id: appID });
    const prescriptionId = appointment.prescription_id;
    const prescription = await Prescription.findById({ _id: prescriptionId });
    const medicines = prescription.medicines;
    var newMedicines = [];
    var medicineName = "";
    medicines.forEach((medicine) => {
      if (medicine.medicineID !== medicineID) {
        newMedicines.push(medicine);
      } else {
        medicineName = medicine.medicineName;
      }
    });
    prescription.medicines = newMedicines;
    prescription.save();
    const send = {
      success: true,
      data: prescription,
      message: `${medicineName} removed successfully`,
    };
    res.status(200).json(send);
    return;
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: `${error.message}`,
    };
    res.status(500).json(send);
  }
};

const getRequestedAppointments = async (req, res) => {
  try {
    const { username } = req.params;
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    const appointments = await Appointments.find({
      status: "requested",
      doctor_id: doctorId,
    });
    const result = [];
    for (const appointment of appointments) {
      const patientId = appointment.patient_id;
      const patient = await Patient.findById({ _id: patientId });
      var patientName = "";
      if (
        appointment.familyMember_nationalId === null ||
        appointment.familyMember_nationalId === ""
      ) {
        patientName = patient.name;
      } else {
        const family = patient.extfamilyMembers;

        family.forEach((member) => {
          if (member.national_id === appointment.familyMember_nationalId) {
            patientName = member.name;
          }
        });
      }
      const appointmentInfo = {
        patientName,
        day: appointment.day,
        slot: appointment.slot,
        type: appointment.type,
        appID: appointment._id,
      };
      result.push(appointmentInfo);
    }
    const send = {
      success: true,
      data: result,
      message: "Requested appointments found successfully",
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

const acceptAppointment = async (req, res) => {
  try {
    const { username } = req.params;

    const { appID, patientName, type, day, slot } = req.body;
    const appointment = await Appointments.findByIdAndUpdate(
      { _id: appID },
      {
        status: "upcoming",
      },
      { new: true }
    );
    var doctor = await Doctor.findOne({ username });
    const doctorId = doctor._id;
    const send = {
      success: true,
      data: appointment,
      message: "Appointment accepted successfully",
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

const revokeAppointment = async (req, res) => {
  try {
    const { appID } = req.body;
    const appointment = await Appointments.findByIdAndUpdate(
      { _id: appID },
      {
        status: "cancelled",
      },
      { new: true }
    );
    const doctorMoney = appointment.price.doctor;
    const patientMoney = appointment.price.patient;
    const doctorId = appointment.doctor_id;
    const patientId = appointment.patient_id;
    const doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $dec: { walletBalance: doctorMoney },
      },
      { new: true }
    );
    const patient = await Patient.findByIdAndUpdate(
      { _id: patientId },
      {
        $inc: { walletBalance: patientMoney },
      },
      { new: true }
    );
    doctor = await Doctor.findByIdAndUpdate(
      { _id: doctorId },
      {
        $set: {
          "availableSlots.$[elem].isBooked": false,
          "availableSlots.$[elem].patientName": "",
          "availableSlots.$[elem].appointmentType": "",
        },
      },
      {
        arrayFilters: [
          { "elem.day": appointment.day, "elem.timeSlot": appointment.slot },
        ],
        new: true,
      }
    );
    const Equate = fetch(`http://localhost:8001/balance/${patient.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        balance: patient.walletBalance,
      }),
    });
    const send = {
      success: true,
      data: appointment,
      message: "Appointment revoked successfully",
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

const getPatient = async (req, res) => {
  try {
    const { appID } = req.params;
    const appointment = await Appointments.findById({ _id: appID });
    const patientId = appointment.patient_id;
    const patient = await Patient.findById({ _id: patientId });
    const prescriptionID = appointment.prescription_id;
    if (
      !(
        prescriptionID === null ||
        prescriptionID === "" ||
        prescriptionID === undefined
      )
    ) {
      const prescription = await Prescription.findById({ _id: prescriptionID });
      prescription.PharmacySubmitStatus = true;
      // prescription.isFilled = true;
      prescription.save();
    }
    const healthPackageType = patient.healthPackageType;
    var discount = 0;
    if (patient.healthPackageType.status === "subscribed") {
      discount = (
        await Packages.findOne({
          packageType: patient.healthPackageType.type,
        })
      ).discountOnMedicinePurchase;
    }
    var data = {
      patient,
      discount,
    };
    const send = {
      success: true,
      data,
      message: "Patient found successfully",
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

const completeAppointments = async (req, res) => {
  const appointments = await Appointments.find({ status: "upcoming" });
  const currentDate = new Date();
  for (var appointment of appointments) {
    if (appointment.endTime < currentDate) {
      appointment.status = "completed";
      await appointment.save();
    }
  }
};

const getPrescriptions = async (req, res) => {
  const { username } = req.params;

  try {
    const doctor = await Doctor.findOne({ username });
    if (doctor) {
      const doctorId = doctor._id;
      var appointments = await Appointments.find({ doctor_id: doctorId });
      var prescriptionIDs = [];
      var valid = true;
      for (const appointment of appointments) {
        valid = true;
        if (
          appointment.prescription_id !== undefined &&
          appointment.prescription_id !== null &&
          appointment.prescription_id !== ""
        ) {
          for (var id of prescriptionIDs) {
            if (id.toString() === appointment.prescription_id.toString()) {
              valid = false;
            }
          }
          if (valid) {
            prescriptionIDs.push(appointment.prescription_id);
          }
        }
      }
      // console.log(prescriptionIDs);
      var prescriptions = [];

      for (const prescription_id of prescriptionIDs) {
        if (
          prescription_id === null ||
          prescription_id === "" ||
          prescription_id === undefined
        ) {
          continue;
        }
        // const prescription_id = prescription.prescription_id;

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
          patient_name: null,
          date: null,
          PharmacySubmitStatus: prescriptionObj.PharmacySubmitStatus,
          isFilled: prescriptionObj.isFilled.toString(),
          medicines: prescriptionObj.medicines,
        };

        const appointObj = await Appointments.findOne({
          prescription_id: prescription_id,
          doctor_id: doctorId,
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
          const patient = await Patient.findById(appointObj.patient_id);
          // const doctorObj = await Doctor.findById(appointObj.doctor_id).catch(
          //   (err) => {
          //     return res.status(500).json({
          //       success: false,
          //       data: null,
          //       message:
          //         err.message ||
          //         "Some error occurred while retrieving doctors.",
          //     });
          //   }
          // );

          if (patient) {
            finalObj.patient_name = patient.name;
          }
        }
        //print the prescription object
        //console.log(finalObj);

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
        message: "Doctor not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getChatPatients = async (req, res) => {
  try {
    const { username } = req.params;
    const doctor = await Doctor.findOne({ username });
    var patientList = doctor.patientList;
    const patients = [];
    const usernames = [];
    for (var i = 0; i < patientList.length; i++) {
      const patientId = patientList[i].patient_id;
      const patientObj = await Patient.findById(patientId);
      if (!patientObj) {
        continue;
      }
      const patientName = patientObj.name;
      const patientUsername = patientObj.username;
      const patientInfo = {
        name: `${patientName}(${patientUsername})`,
        username: patientUsername,
        patientID: patientObj._id,
        doctorID: doctor._id,
      };
      if (!usernames.includes(patientUsername)) {
        patients.push(patientInfo);
        usernames.push(patientUsername);
      }
    }
    const send = {
      success: true,
      data: patients,
      message: "Patients found successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: error.message,
    };
    res.status(500).json(send);
  }
};

const saveAdditionalMedicines = async (req, res) => {
  try {
    const { appID, additionalMedicines } = req.body;
    var appointment = await Appointments.findById({ _id: appID });
    var prescriptionId = appointment.prescription_id;
    if (
      prescriptionId === null ||
      prescriptionId === undefined ||
      prescriptionId === ""
    ) {
      const prescription = await Prescription.create({
        PharmacySubmitStatus: false,
        isFilled: false,
        additionalMedicines,
      });
      prescriptionId = prescription._id;
      appointment = await Appointments.findByIdAndUpdate(
        { _id: appID },
        {
          prescription_id: prescriptionId,
        },
        { new: true }
      );
      const patient = await Patient.findById({ _id: appointment.patient_id });
      patient.perscreption_ids.push({ prescription_id: prescriptionId });
      patient.save();
      const send = {
        success: true,
        data: prescription,
        message:
          "Prescription created successfully and additional medicines added",
      };
      res.status(200).json(send);
      return;
    }
    const prescription = await Prescription.findById({ _id: prescriptionId });
    prescription.additionalMedicines = additionalMedicines;
    prescription.save();
    const send = {
      success: true,
      data: prescription,
      message: "Additional medicines saved successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: error.message,
    };
    res.status(500).json(send);
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    var doctorList = [];
    for (var doctor of doctors) {
      const doctorInfo = {
        name: `${doctor.name}(${doctor.username})`,
        username: doctor.username,
      };
      doctorList.push(doctorInfo);
    }
    const send = {
      success: true,
      data: doctorList,
      message: "Doctors found successfully",
    };
    res.status(200).json(send);
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: error.message,
    };
    res.status(500).json(send);
  }
}




const AddNotificationD = async (req, res) => {
  // Extract other health record properties from the request body

  const username = req.body.username;
  const title = req.body.title;
  const notification = req.body.notification;


  console.log(username);
  console.log(title);
  console.log(notification);


  try {
    // Fetch existing health records
    const doctor = await Doctor.findOne({username});

    if (!doctor) {
      console.log("doctor not found:", req.params.username);

      return res.status(404).json({
        success: false,
        message: "doctor not found",
        data: null,
      });
    }
    let isSeen=false;
    doctor.notifications.push({ isSeen, title, notification });

    const updatedDoctor = await doctor.save();

    res.status(201).json({
      success: true,
      message: "Notification added successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};


const markNotificationAsSeenD = async (req, res) => {
  try {
    const { username, notificationId } = req.params;

    console.log("HEREEE")
    // Find the patient by username
    const doctor = await Doctor.findOne({ username });

    // Check if the patient exists
    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" });
    }

    // Find the notification by ID within the patient's notifications
    const notification = doctor.notifications.id(notificationId);

    // Check if the notification exists
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Mark the notification as seen
    notification.isSeen = true;

    // Save the updated patient (which includes the updated notification)
    await doctor.save();

    // Respond with a success message
    res.json({ message: "Notification marked as seen successfully" });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getAllUnseenNotificationsD = async (req, res) => {
  const { username } = req.params;

  console.log(username)
  try {
    const doctor = await Doctor.findOne({ username });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "doctor not found",
        data: null,
      });
    }

    // Filter out the unseen notifications
    const unseenNotifications = doctor.notifications.filter(
      (notification) => !notification.isSeen
    );
      console.log(unseenNotifications)
    res.status(200).json({
      success: true,
      message: "Unseen notifications retrieved successfully",
      data: unseenNotifications,
    });
  } catch (error) {
    console.log("ENTERED THE CATCH")
    res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

const sendEmailD = async (req, res) => {
  //try{


  const { email,message,subject } = req.body;

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: 'el7a2ni.virtual@gmail.com',
      pass: 'zijy ztiz drcn ioxq'
    }
  });


  
  const info = await transporter.sendMail({

    from : 'SkillIssue <el7a2ni.virtual@gmail.com>',
    to: email,
    subject: subject,
    text: message
  },(err)=>{
    if(err){
      console.log('it has an error', err)
    }
    else{
      res.status(200).json({
        success: true,
        message: "Email sent",
      });    
        console.log('email sent')
    }
  })
  //}
  //catch{
  //console.log("Message sent: "+ info.messageId)
  //}
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
  cancelAppointment,
  addToPrescription,
  getMedicinesStatus,
  removeFromPrescription,
  getRequestedAppointments,
  acceptAppointment,
  revokeAppointment,
  getPatient,
  completeAppointments,
  getPrescriptions,
  getChatPatients,
  saveAdditionalMedicines,
  getDoctors
  AddNotificationD,
  markNotificationAsSeenD,
  getAllUnseenNotificationsD,
  sendEmailD,
};
