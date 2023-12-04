const router = require("express").Router();
const {
    sendPrescriptionMedicinesToPharmacy,setIsFilledForPrescription
} = require("../controllers/prescriptionFromPharmacy")


router.post("/setIsFilledForPrescription",setIsFilledForPrescription);

router.post("/sendPrescriptionMedicinesToPharmacy", sendPrescriptionMedicinesToPharmacy);
module.exports = router;