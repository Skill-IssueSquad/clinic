const router = require("express").Router();

const {
    viewAdmins,
    createAdmin,
    removeAdmin,
    viewDoctors,
    removeDoctor,
    viewPatients,
    removePatient,    
    viewDoctorApplications,
    viewHealthPackages,
    addHealthPackage,
    updateHealthPackage,
    deleteHealthPackage
} = require("../controllers/AdminController");

router.get("/viewAdmins", viewAdmins);
router.post("/createAdmin", createAdmin);
router.delete("/removeAdmin/:username", removeAdmin);
router.get("/viewDoctors", viewDoctors);
router.delete("/removeDoctor/:username", removeDoctor);
router.get("/viewPatients", viewPatients);
router.delete("/removePatient/:username", removePatient);
router.get("/viewInfo", viewDoctorApplications);
router.get("/viewPackages", viewHealthPackages);
router.post("/addPackage", addHealthPackage);
router.patch("/updatePackage/:packageType", updateHealthPackage);
router.delete("/deletePackage/:packageType", deleteHealthPackage);

module.exports = router;