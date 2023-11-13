const express = require("express");
const router = express.Router();
const doctorRequest = require("../models/DoctorRequest");

const path = require("path")
const multer = require("multer")


//get all doctor requests
router.get("/",async (req, res) => {
  try {
    const doctorrequest = await doctorRequest.find();
    res.status(200).json({
      messgage: " got all pharmacist requests successfully",
      status: true,
      data: doctorrequest,
    });
  } catch (err) {
    res.status(400).json({
      messgage: " Failed to get all pharmacist requests.",
      status: false,
      data: null,
    });
  }
});




/*let nameFile;
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'images')
  },
  filename : (req,file,cb)=> {
   nameFile= Date.now() + "--" + file.originalname
   req.nameFile=nameFile
    cb(null,nameFile)
  }
})
const upload=multer({storage:storage})*/

/*// Define multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const nameFile = Date.now() + '--' + file.originalname;
    req.nameFile = nameFile;
    cb(null, nameFile);
  },
});*/

let nameFiles = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'documents');
  },
  filename: (req, file, cb) => {
    const nameFile = Date.now() + "--" + file.originalname;
    nameFiles.push(nameFile);
    req.nameFiles=nameFiles
    cb(null, nameFile);
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });


//Request registeration as doctor
router.post("/", upload.array('documents', 3),async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    hourlyRate,
    affiliatedHospital,
    educationalBackground,
  } = req.body;
  console.log(req.nameFiles)
  console.log(req.body)

  let personalId = "http://localhost:8000/documents/"+req.nameFiles[0];
  let doctorDegree = "http://localhost:8000/documents/"+req.nameFiles[1];
  let workingLicense = "http://localhost:8000/documents/"+req.nameFiles[2];
  nameFiles=[]
  console.log("after: "+nameFiles)

  let documents = 
  [
    {
      documentType: 'pdf',
      documentName: 'personalId',
      documentUrl: personalId,
    },
    {
      documentType: 'pdf',
      documentName: 'doctorDegree',
      documentUrl: doctorDegree,
    },
    {
      documentType: 'pdf',
      documentName: 'workingLicense',
      documentUrl: workingLicense,
    },

    
  ]

  try {
    const doctorrequest = await doctorRequest.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliatedHospital,
      educationalBackground,
      documents
    });
    res.status(200).json({
      messgage: "Submitted Application successfully",
      status: true,
      data: doctorrequest,
    });
  } catch (err) {
    console.error('Error creating pharmacist request:', err);

    /*console.log(username)
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(dateOfBirth)
    console.log(hourlyRate)
    console.log(affiliatedHospital)
    console.log(educationalBackground)
    console.log(documents)
*/


    res.status(400).json({
      messgage: " Failed to submit request.",
      status: false,
      data: null,
    });
  }
});

module.exports = router;
