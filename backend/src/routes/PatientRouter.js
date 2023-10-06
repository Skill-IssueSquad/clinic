const express = require("express");
const router = express.Router();
const { addFamMember } = require("../controllers/PatientController");

router.get("/", (req, res) => {});

router.patch("/addFamMember/:username", addFamMember);

module.exports = router;
