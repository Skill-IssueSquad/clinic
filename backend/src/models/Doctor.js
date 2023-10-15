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
        starttime: {
          type: Date,
          required: true,
        },
        endtime: {
          type: Date,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
