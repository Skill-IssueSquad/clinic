const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followUpRequestSchema = new Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: "Patient",
    required: true,
  },
  relativeNationalID: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  previous_appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointments",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const followUpRequest = mongoose.model("FollowUpRequest", followUpRequestSchema);
module.exports = followUpRequest;
