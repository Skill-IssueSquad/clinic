const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Clinic = require("../models/Clinic");
const mongoose = require("mongoose");



const sendPrescriptionMedicinesToPharmacy = async (req, res) => {

    const {username}= req.body;

    // find if there is patient with this username
    try {
        const patient = await getPatient(username);
        if (patient) {
            const prescriptionIDs = patient.perscreption_ids;



            let prescriptions =[]

            for(let i=0; i<prescriptionIDs.length; i++){
                
                let prescription = await Prescription.findOne({ _id: prescriptionIDs[i].prescription_id });

                prescriptions.push(prescription);
            }


            let medicinesArray = [];
            for(let i=0; i<prescriptions.length; i++){
                console.log(prescriptions[i]);
               for(let j = 0; j<prescriptions[i].medicines.length; j++){
                   medicinesArray.push(prescriptions[i].medicines[j]);
               }
               
            }
            console.log(medicinesArray);



           return res.status(200).json({
             success: true,
             data: medicinesArray,
             message: "Patient retrieved successfully",
           });
        } else {
          return res.status(404).json({
            success: false,
            data: null,
            message: "Patient not found",
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          data: null,
          message:
            error.message || "Some error occurred while retrieving patient.",
        });
      }


      

}



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


  module.exports = {
    sendPrescriptionMedicinesToPharmacy
  };
  