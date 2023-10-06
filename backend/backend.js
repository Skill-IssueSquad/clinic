require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(8000, () => console.log("Server Started"));
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);

//const subscribersRouter = require('./routes/subscribers')
//app.use('/subscribers', subscribersRouter
