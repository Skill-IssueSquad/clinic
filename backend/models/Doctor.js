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
    required: false,
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
          required: true,
        },
      },
    ],
  },
  patientList: {
    type: [
      {
        type: String,
      },
    ],
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
