const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorRequestSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
  documents: [
    {
      documentType: {
        type: String,
        required: true,
      },
      documentName: {
        type: String,
        required: true,
      },
      documentFile: {
        type: String, //not sure abt this tho
        required: true,
      },
    },
  ],
});

const doctorRequest = mongoose.model("DoctorRequest", doctorRequestSchema);
module.exports = doctorRequest;
