const router = require("express").Router();
const {
    sendPrescriptionMedicinesToPharmacy,setIsFilledForPrescription,setTakenForPres
} = require("../controllers/prescriptionFromPharmacy")


router.post("/setIsFilledForPrescription",setIsFilledForPrescription);

router.post("/sendPrescriptionMedicinesToPharmacy", sendPrescriptionMedicinesToPharmacy);
router.post("/getMedicinesFromPharmacy", setTakenForPres);

module.exports = router;