const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
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
  gender: {
    type: String,
    enum: ["M", "F", "Bahy"],
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  emergencyContact: {
    //not sure if it is one or multiple
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  healthPackageType: {
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    type: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
    renewal: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
    },
  },
  creditCards: [
    {
      cardNum: {
        type: Number,
        required: true,
      },
      expr_date: {
        type: Date,
        required: true,
      },
      cardHolderName: {
        type: String,
        required: true,
      },
      CVV: {
        type: Number,
        required: true,
      },
    },
  ],
  healthRecords: [
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
  extfamilyMembers: [
    {
      name: {
        type: String,
        required: true,
      },
      relation: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      national_id: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["M", "F", "Bahy"],
        required: true,
      },
      healthPackageType: {
        status: {
          type: String,
          enum: ["active", "inactive"],
          default: "inactive",
        },
        type: {
          type: String,
          enum: ["basic", "premium"],
          default: "basic",
        },
        renewal: {
          type: Boolean,
          default: false,
        },
        endDate: {
          type: Date,
        },
      },
    },
  ],
  linkedAccounts: [
    {
      patient_ids: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    },
  ],
  perscreption_ids: [
    {
      prescription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    },
  ],
});

patientModel = mongoose.model("Patient", patientSchema);
module.exports = patientModel;
