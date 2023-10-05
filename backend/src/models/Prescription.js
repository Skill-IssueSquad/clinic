const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  PharmacySubmitStatus: {
    type: Boolean,
    required: true,
  },
  isFilled: {
    type: Boolean,
    required: true,
  },
  medicines: {
    type: [
      {
        medcineName: {
          type: String,
          required: true,
        },
        dose: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  }
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
