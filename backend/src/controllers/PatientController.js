const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointments = require("../models/Appointments");

async function getPatient(username) {
  try {
    const user = await Patient.findOne({ username: username }).catch((err) => {
      return null;
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  } catch (err) {
    return null;
  }
}

const getAllAppointments = async (req, res) => {
  // Used when the front end handles the sorting
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username
  try {
    const username = req.params.username;
    const patient = await getPatient(username);
	
    if (patient) {
      const appointments = await Appointments.find({
        patient_id: patient._id,
      }).catch((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            data: null,
            message:
              err.message ||
              "Some error occurred while retrieving appointments.",
          });
        }
      });

      return res.status(200).json({
        success: true,
        data: appointments,
        message: "Successfully retrieved all appointments",
      });
    } else {
      // username does not exist
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const getAppointmentsByDate = async (req, res) => {
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, { date: "2021-04-20" }
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    const appointments = await Appointments.find({
      patient_id: patient._id,
      date: req.body.date,
    }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: req.body.date,
          message:
            err.message || "Some error occurred while retrieving appointments.",
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Successfully retrieved all appointments",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const getAppointmentsByStatus = async (req, res) => {
  // EVENTUALLY JWT AUTHENTICATION
  // EXPECTED INPUT: param: username, { status: "upcoming" }
  // status: "(upcoming, completed, cancelled, rescheduled)"
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    // check for invalid status
    if (
      !["upcoming", "completed", "cancelled", "rescheduled"].includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        success: false,
        data: req.body.status,
        message:
          "Invalid status " +
          req.body.status +
          ". Valid statuses are (upcoming, completed, cancelled, rescheduled).",
      });
    }

    const appointments = await Appointments.find({
      status: req.body.status,
      patient_id: patient._id,
    }).catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: req.body.status,
          message:
            err.message || "Some error occurred while retrieving appointments.",
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Successfully retrieved all appointments",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: req.body.status,
      message:
        err.message || "Some error occurred while retrieving appointments.",
    });
  }
};

const viewAllDoctors = async (req, res) => {
  // ASSUMES JWT AUTHENTICATION
  // EXPECTED INPUT: param: username
  try {
    const username = req.params.username;
    const patient = await getPatient(username);

    if (!patient) {
      return res.status(404).json({
        success: false,
        data: username,
        message: `Patient with username ${username} does not exist`,
      });
    }

    let doctors = await Doctor.find().catch((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            err.message || "Some error occurred while retrieving doctors.",
        });
      }
    });

    doctors = doctors.map((doctor) => {
		// get each doctors markup from contract
		if (doctor.contracts.length > 0) {
		  const markup = doctor.contracts[0].markupOnSalary;
	  
		  // check on health package type for discount
		  let discount = 0;
		  if (patient.healthPackageType) {
			if (patient.healthPackageType.status === "subscribed") {
			  if (patient.healthPackageType.type === "silver") {
				discount = 0.4;
			  } else if (patient.healthPackageType.type === "platinum") {
				discount = 0.8;
			  } else if (patient.healthPackageType.type === "gold") {
				discount = 0.6;
			  }
			}
		  }
	  
		  const sessionPrice = (doctor.hourlyRate + 0.1 * markup) * (1 - discount);
		  
		  // Return a new object with the modified properties
		  return { ...doctor._doc, sessionPrice };
		} else {
		  // no contract for this doctor
		  const sessionPrice = -1;
		  
		  // Return a new object with the modified properties
		  return { ...doctor._doc, sessionPrice };
		}
	  });

    return res.status(200).json({
      success: true,
      data: doctors,
      message: "Successfully retrieved all doctors",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message || "Some error occurred while retrieving doctors.",
    });
  }
};

module.exports = {getAllAppointments, getAppointmentsByDate, getAppointmentsByStatus, viewAllDoctors};
