const router = require("express").Router();
const {
  getDoctor,
  createDoctor,
  updateDoctor,
} = require("../controllers/DoctorController");
router.get("/:username", getDoctor);
router.post("/create", createDoctor);
router.put("/update/:username", updateDoctor);
module.exports = router;
