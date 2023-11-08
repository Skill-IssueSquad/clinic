const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clinicSchema = new Schema({
  markupPercentage: {
    type: Number,
    required: true,
  },
});

const Clinic = mongoose.model("Clinic", clinicSchema);
module.exports = Clinic;
