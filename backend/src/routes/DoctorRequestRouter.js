const router = require("express").Router();
const multer = require("multer")
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({ storage });
const {
    viewInfo,
    updateInfo,
} = require("../controllers/DoctorRequestController");

router.post("/viewInfo",  viewInfo);
router.patch("/updateInfo/:username", upload.single('pdf'), updateInfo);


module.exports = router;