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
const Patient = require("./src/models/Patient");
const Packages = require("./src/models/Packages");
const patientRouter = require("./src/routes/PatientRouter");
const prescriptionRouter = require("./src/routes/prescriptionFromPharmacyRoute");

const { equateBalance } = require("./src/controllers/Balance");
const { completeAppointments } = require("./src/controllers/DoctorController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const doctorRequestRouter = require("./src/routes/DoctorRequestRouter");
const accountRouter = require("./src/routes/AccountRouter");
const cookieParser = require("cookie-parser");
const {
  authAdmin,
  authDoctor,
  authDoctorRequest,
  authPatient,
} = require("./src/middleware/Authentication");
const {
  getPatient,
  getDoctors,
  sendEmailFunc
} = require("./src/controllers/DoctorController");
const doctorRequest = require("./src/models/DoctorRequest");
// router.get("/getPatient/:appID", getPatient);
//socket for video server
//server is only used to set up the rooms
const socketVideoServer = require("http").createServer(app);
const videoIo = require("socket.io")(socketVideoServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const { v4: uuidV4 } = require("uuid");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where the files will be stored
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage: storage });

const io = new Server(process.env.SOCKET_PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log(`Socket ID : ${socket.id}`);
  socket.on("join-room", (data) => {
    //console.log(data);
    socket.join(data.roomId);
    console.log("Joined room ", data.roomId);
  });
  socket.on("send-message", (data) => {
    // console.log(data);
    const send = {
      message: data.message,
      time: data.time,
      roomId: data.roomId,
    };
    socket.to(data.roomId).emit("receive-message", send);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server Started on port ", process.env.PORT)
    );
    socketVideoServer.listen(process.env.VIDEO_PORT, () =>
      console.log("Video Server Started on port ", process.env.VIDEO_PORT)
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

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your frontend
    credentials: true, // Allow credentials (cookies, etc.) to be sent
  })
);



app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/DoctorStaticData", express.static("DoctorStaticData"));
app.use("/documents", express.static("documents"));
app.use("/Documents", express.static("Documents"));

app.use(cookieParser());
//app.use("/doctor", authDoctor, doctorRouter);
app.use("/doctor",  doctorRouter);
app.use("/admin", authAdmin, adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));
app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);
app.use("/patient", authPatient, patientRouter);
//app.use("/patient", patientRouter);

app.use("/account", accountRouter);
app.use("/doctorRequest", authDoctorRequest, doctorRequestRouter);
app.get("/getPatient/:appID", getPatient);
app.get("/getDoctors/", getDoctors);
app.post("/notifyPatient", sendEmailFunc);
app.post("/balance/:username", equateBalance);
app.use("/getPrescription",prescriptionRouter);
//get requests for video server
// app.post("/video", (req, res) => {
//   const patientId = req.body.patientId;
//   const doctorId = req.body.doctorId;

//   res.redirect(`http://localhost:${3000}/videoCall/${String(patientId)}${String(doctorId)}`);
// });

videoIo.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("user", userId, "joined room", roomId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      console.log("user", userId, "left room", roomId);
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
// Schedule the task to run at 00:00 (midnight) every day
cron.schedule("0 0 * * *", completeAppointments);


app.post("/getPatientDiscount", async (req, res) => {
  try {
    const patientUsername = req.body.username;

    const findPatient = await Patient.findOne({ username: patientUsername }).catch(
      (err) => {
        return res.status(200).json({ success: false, data: {discount: 0}, message: err || "Error"});
      }
    );

    if (!findPatient) {
      return res.status(200).json({ success: false, data: {discount: 0}, message: "Patient not found"});
    } else {
      // get health package discount

      if (findPatient.healthPackageType !== "unsubscribed") {
        // get health package discount
        const healthPackage = await Packages.findOne({ name: findPatient.healthPackageType }).catch(
          (err) => {
            return res.status(200).json({ success: false, data: {discount: 0}, message: err || "Error"});
          }
        );

        if (!healthPackage) {
          return res.status(200).json({ success: false, data: {discount: 0}, message: "Health package not found"});
        } else {
          return res.status(200).json({ success: true, data: {discount: healthPackage.discount}, message: "Health package discount found"});
        }
      }
    
    }
    
  } catch (error) {
    return res.status(400).json({ success: false, data: req.body, message: error.message || "Error"});
  }
});
