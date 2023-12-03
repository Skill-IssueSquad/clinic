const router = require("express").Router();
const {
    sendPrescriptionMedicinesToPharmacy
} = require("../controllers/prescriptionFromPharmacy")




router.post("/sendPrescriptionMedicinesToPharmacy", sendPrescriptionMedicinesToPharmacy);
module.exports = router;