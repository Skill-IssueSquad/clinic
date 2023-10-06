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
      enum: ["subscribed", "unsubscribed", "canceled"],
      default: "unsubscribed",
    },
    type: {
      type: String,
      enum: ["silver", "platinum", "gold"],
      default: "",
    },
    renewal: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    // default: {},
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
  healthRecords: {
    type: [
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
          type: Buffer, //not sure abt this tho
          required: true,
        },
      },
    ],
    default: [],
  },
  extfamilyMembers: [
    {
      name: {
        type: String,
        required: true,
      },
      relation: {
        type: String,
        enum: ["wife", "husband", "son", "daughter"],
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
          enum: ["subscribed", "unsubscribed", "canceled"],
          default: "unsubscribed",
        },
        type: {
          type: String,
          enum: ["silver", "platinum", "gold"],
          default: "",
        },
        renewal: {
          type: Date,
          required: true,
          default: Date.now(),
        },
        endDate: {
          type: Date,
          required: true,
          default: Date.now(),
        },
      },
    },
  ],
  linkedAccounts: [
    {
      patient_id: {
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

const patientModel = mongoose.model("Patient", patientSchema);
module.exports = patientModel;
