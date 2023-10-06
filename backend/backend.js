require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(8000, () => { 
      console.log("Server started");
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());

const patientRouter = require("./src/routes/PatientRouter");
app.use("/patient", patientRouter);
