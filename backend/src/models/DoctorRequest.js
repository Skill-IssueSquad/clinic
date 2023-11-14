const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorRequestSchema = new Schema({
  status: {
    type: String,
    enum: ["Pending", "Missing Documents", "Accepted", "Rejected"],
    default: "Pending",
  },
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
  // documents: {
  //   type: [
  //     {
  //       documentType: {
  //         type: String,
  //         required: true,
  //       },
  //       documentName: {
  //         type: String,
  //         required: true,
  //       },
  //       documentFile: {
  //         type: Buffer, //not sure abt this tho
  //         required: true,
  //       },
  //     },
  //   ],
  //   default: []
  // },
  ID : {
    data: Buffer,
  },
  License : {
    data: Buffer,
  },
  Degree : {
    data: Buffer,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  }
});

const doctorRequest = mongoose.model("DoctorRequest", doctorRequestSchema);
module.exports = doctorRequest;
