const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  affiliatedHospital: {
    type: String,
    required: true,
  },
  educationalBackground: {
    type: String,
    required: true,
  },
  contracts: {
    type: [
      {
        markupOnSalary: {
          type: Number,
        },
      },
    ],
    required: true,
    default: [],
  },
  patientList: {
    type: [
      {
        patient_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        //ref: "Patient", //what is that idk
      },
    ],
    required: true,
    default: [],
  },
  availableSlots: {
    type: [
      {
        day: {
          type: String,
          required: true,
        },
        timeSlot: {
          type: String,
          required: true,
        },
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        isBooked: {
          type: Boolean,
          required: true,
          default: false,
        },
        patientName: {
          type: String,
        },
        appointmentType: {
          type: String,
        },
      },
    ],
    required: true,
    default: [],
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  contractAccepted: {
    type: Boolean,
    default: false,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;