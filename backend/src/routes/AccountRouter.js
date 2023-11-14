const router = require("express").Router();

const {
    registerDoctor,
    registerPatient,
    login,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword
} = require("../controllers/AccountController");

router.post("/registerPatient", registerPatient);
router.post("/registerDoctor", registerDoctor);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);

module.exports = router;