const router = require("express").Router();
const { getDoctor, createDoctor } = require("../controllers/DoctorController");
router.get("/:username", getDoctor);
router.post("/create", createDoctor);
module.exports = router;
