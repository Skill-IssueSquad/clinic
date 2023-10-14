require("dotenv").config();

//express app
const express = require("express");
const app = express();
const cors = require("cors");
const PatientRegisteration = require("./src/routes/patientRegisteration");
const DoctorRegisteration = require("./src/routes/doctorRegisteration");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

//middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes

app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);

//connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Connection to DB successful, server started on port",
        process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
