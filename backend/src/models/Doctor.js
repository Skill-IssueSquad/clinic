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
    required: false,
  },
  patientList: {
    type: [
      {
        patient_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        ref: "Patient", //what is that idk
      },
    ],
    required: false,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
