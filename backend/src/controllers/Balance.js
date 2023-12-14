const Patient = require("../models/Patient");
const equateBalance = async (req, res) => {
  try {
    const { username } = req.params;
    const { balance } = req.body;
    var patient = Patient.findOne({ username: username });
    if (patient) {
      patient.walletBalance = balance;
      await patient.save();
      const send = {
        success: true,
        data: patient,
        message: "Balance updated successfully",
      };
      res.status(200).json(send);
      return;
    } else {
      const send = {
        success: true,
        data: null,
        message: "The patient does not have an account",
      };
      res.status(200).json(send);
      return;
    }
  } catch (error) {
    const send = {
      success: false,
      data: null,
      message: error.message,
    };
    res.status(500).json(send);
  }
};

module.exports = {
  equateBalance,
};
