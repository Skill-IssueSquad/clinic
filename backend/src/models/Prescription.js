const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  PharmacySubmitStatus: {
    type: Boolean,
    required: true,
  },
  isFilled: {
    type: Boolean,
    required: false,
  },
  medicines: {
    type: [
      {
        medicineName: {
        medicineName: {
          type: String,
          required: true,
        },
        dose: {
          type: String,
          required: true,
        },
        medicineID: {
          type: String,
          required: true,
        },
        taken: {
          type: Boolean,
          required: false,
        },
      },
    ],
    default: [],
  },
  additionalMedicines: {
    type: String,
    default: "",
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
