require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");
const PatientRegisteration = require("./src/routes/patientRegisteration");
const DoctorRegisteration = require("./src/routes/doctorRegisteration");
const patientRouter = require("./src/routes/PatientRouter");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, { apiVersion: '' });
// Import necessary modules
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ... (previous imports and functions)

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where the files will be stored
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server Started on port ", process.env.PORT)
    );
  })
  .catch((err) => console.log(err));

app.get("/config", (req, res) => {
  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/DoctorStaticData", express.static("DoctorStaticData"));
app.use("/documents", express.static("documents"));


app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));
app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);
app.use("/patient", patientRouter);
