const DoctorRequest = require("../models/DoctorRequest");
const router = require("express").Router();
const multer = require("multer")

const {
    viewInfo,
} = require("../controllers/DoctorRequestController");

router.post("/viewInfo",  viewInfo);

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


//Update doctor request info
router.patch("/updateInfo/:username", upload.array('documents', 3), async (req,res) => { 

    let personalId = "http://localhost:8000/documents/"+req.nameFiles[0];
    let pharmacyDegree = "http://localhost:8000/documents/"+req.nameFiles[1];
    let workingLicense = "http://localhost:8000/documents/"+req.nameFiles[2];
    nameFiles=[]

    let documents = 
    [
        {
        documentType: 'pdf',
        documentName: 'personalId',
        documentUrl: personalId,
        },
        {
        documentType: 'pdf',
        documentName: 'pharmacyDegree',
        documentUrl: pharmacyDegree,
        },
        {
        documentType: 'pdf',
        documentName: 'workingLicense',
        documentUrl: workingLicense,
        },
    ]

    const condition = {username: req.params.username};
    const updateData = documents;
    const update = { $set: {'documents': updateData}};
    DoctorRequest.updateOne(condition, update)
     .then(() => {
        const reply = {
            success: true,
            data: req.params.update,
            message: "Doctor request updated successfully",
        };
        res.status(200).json(reply);
     })
     .catch((error) => {
        const reply = {
            success: false,
            data: null,
            message: error.message,
        };
        console.log(error.message)
        res.status(400).json(reply);
     })
});


module.exports = router;