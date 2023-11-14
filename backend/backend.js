require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");
const PatientRegisteration = require("./src/routes/patientRegisteration");
const DoctorRegisteration = require("./src/routes/doctorRegisteration");
const patientRouter = require("./src/routes/PatientRouter");
const doctorRequestRouter = require("./src/routes/DoctorRequestRouter");
const accountRouter = require("./src/routes/AccountRouter");
const cookieParser = require('cookie-parser');
const {authAdmin, authDoctor, authDoctorRequest ,authPatient} = require("./src/middleware/Authentication");
const doctorRequest = require("./src/models/DoctorRequest");


mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(8000, () => console.log("Server Started"));
  })
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/DoctorStaticData", express.static("DoctorStaticData"));
app.use(cookieParser());
app.use("/doctor", authDoctor, doctorRouter);
app.use("/admin", authAdmin, adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));
app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);
app.use("/patient", authPatient, patientRouter);
app.use("/account", accountRouter);
app.use("/doctorRequest", authDoctorRequest, doctorRequestRouter);


