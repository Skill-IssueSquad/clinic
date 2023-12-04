require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

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

const mongoose = require("mongoose");
const doctorRouter = require("./src/routes/DoctorRouter");
const adminRouter = require("./src/routes/AdminRouter");
const PatientRegisteration = require("./src/routes/patientRegisteration");
const DoctorRegisteration = require("./src/routes/doctorRegisteration");
const patientRouter = require("./src/routes/PatientRouter");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "",
});
// Import necessary modules
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ... (previous imports and functions)

// Multer configuration
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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/DoctorStaticData", express.static("DoctorStaticData"));
app.use("/documents", express.static("documents"));
app.use("/Documents", express.static("Documents"));

app.use(cookieParser());
app.use("/doctor", authDoctor, doctorRouter);
app.use("/admin", authAdmin, adminRouter);
app.use("/AdminStaticData", express.static("AdminStaticData"));
app.use("/register/patient", PatientRegisteration);
app.use("/register/doctor", DoctorRegisteration);
//app.use("/patient", authPatient, patientRouter);
app.use("/patient", patientRouter);
app.use("/account", accountRouter);
app.use("/doctorRequest", authDoctorRequest, doctorRequestRouter);

//get requests for video server
app.get("/video", (req, res) => {
  res.redirect(`http://localhost:${3000}/videoCall/${uuidV4()}`);
});

videoIo.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("joined room", roomId, "as user", userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
