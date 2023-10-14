require("dotenv").config();

const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");


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

app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));

