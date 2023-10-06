const express = require("express");
const router = express.Router();
const {
  addFamMember,
  getFamMembers,
} = require("../controllers/PatientController");

router.get("/", (req, res) => {});

//add family member route
router.patch("/addFamMember/:username", addFamMember);

//get family members route
router.get("/getFamMembers/:username", getFamMembers);

module.exports = router;
