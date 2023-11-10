const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  type: {
    type: String,
    enum: ["followUp", "appointment"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: "Patient",
    required: true,
  },
  prescription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    // required: true,
    default: null,
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled", "rescheduled"],
    required: true,
  },
  familyMember_nationalId: {
    type: String,
    // required: true,
    default: null,
  },
});

const Appointments = mongoose.model("Appointments", appointmentSchema);
module.exports = Appointments;
