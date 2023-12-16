const router = require("express").Router();
const {authAdmin} = require("../middleware/Authentication");

const {
    getAdmin,
    viewAdmins,
    createAdmin,
    removeAdmin,
    viewDoctors,
    removeDoctor,
    viewPatients,
    removePatient,    
    viewDoctorApplications,
    acceptDoctor,
    rejectDoctor,
    viewHealthPackages,
    addHealthPackage,
    updateHealthPackage,
    deleteHealthPackage
} = require("../controllers/AdminController");

router.post("/getAdmin/:username", getAdmin);
router.get("/viewAdmins",  viewAdmins);
router.post("/createAdmin",  createAdmin);
router.delete("/removeAdmin/:username",  removeAdmin);
router.get("/viewDoctors",  viewDoctors);
router.delete("/removeDoctor/:username",  removeDoctor);
router.get("/viewPatients",  viewPatients);
router.delete("/removePatient/:username",  removePatient);
router.get("/viewInfo",  viewDoctorApplications);
router.post("/acceptDoctor", acceptDoctor);
router.post("/rejectDoctor", rejectDoctor);
router.get("/viewPackages",  viewHealthPackages);
router.post("/addPackage",  addHealthPackage);
router.patch("/updatePackage/:packageType",  updateHealthPackage);
router.delete("/deletePackage/:packageType",  deleteHealthPackage);

// i think ill remove all the auth and jus use one at the beginning of route

module.exports = router;