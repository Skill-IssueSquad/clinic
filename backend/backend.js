require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");
const PatientRegisteration = require("./src/routes/patientRegisteration");
const DoctorRegisteration = require("./src/routes/doctorRegisteration");
const patientRouter = require("./src/routes/PatientRouter");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "",
});
const { equateBalance } = require("./src/controllers/Balance");
const { completeAppointments } = require("./src/controllers/DoctorController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage: storage });
const doctorRequestRouter = require("./src/routes/DoctorRequestRouter");
const accountRouter = require("./src/routes/AccountRouter");
const cookieParser = require("cookie-parser");
const {
  authAdmin,
  authDoctor,
  authDoctorRequest,
  authPatient,
} = require("./src/middleware/Authentication");
const doctorRequest = require("./src/models/DoctorRequest");
const io = new Server(process.env.SOCKET_PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ID : ${socket.id}`);
  socket.on("join-room", (data) => {
    //console.log(data);
    socket.join(data.roomId);
    console.log("Joined room ", data.roomId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
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
app.use("/Documents", express.static("Documents"));

app.use(cookieParser());
//app.use("/doctor", authDoctor, doctorRouter);
app.use("/doctor", doctorRouter);
app.use("/admin", authAdmin, adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));
app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);
//app.use("/patient", authPatient, patientRouter);
app.use("/patient", patientRouter);
app.use("/account", accountRouter);
app.use("/doctorRequest", authDoctorRequest, doctorRequestRouter);

app.post("/balance/:username", equateBalance);

// Schedule the task to run at 00:00 (midnight) every day
cron.schedule("0 0 * * *", completeAppointments);
