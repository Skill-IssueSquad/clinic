const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Clinic = require("../models/Clinic");
const mongoose = require("mongoose");



const sendPrescriptionMedicinesToPharmacy = async (req, res) => {

    const {username}= req.body;
    console.log("I reached here: "+username);
    // find if there is patient with this username
    try {
        const patient = await getPatient(username);
        if (patient) {
            const prescriptionIDs = patient.perscreption_ids;



            let prescriptions =[]

            for(let i=0; i<prescriptionIDs.length; i++){
                
                let prescription = await Prescription.findOne({ _id: prescriptionIDs[i].prescription_id });

                console.log(prescription);
              //  if(prescription.isFilled === false){
                if(prescription.isFilled == false && prescription.PharmacySubmitStatus == true){
                  prescriptions.push(prescription);
                }
              //  }
            }


            let medicinesArray = [];
            for(let i=0; i<prescriptions.length; i++){
                console.log(prescriptions[i]);
               for(let j = 0; j<prescriptions[i].medicines.length; j++){
                   medicinesArray.push(prescriptions[i].medicines[j]);
               }
               
            }
          //  console.log(medicinesArray);



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



// const setIsFilledForPrescription = async (req, res) => {
//   try {
//     const {id}= req.body;  
//     console.log(id);
//     const Pres = await Prescription.findOne({ _id: id }).catch((err) => {
//       return null;
//     });

//     if (!Pres) {
//       return null;
//     }
//     console.log(Pres);
//     Pres.isFilled = true;
//     return Pres.toJSON();
//   } catch (err) {
//     return null;
//   }
// }

// const setIsFilledForPrescription = async (req, res) => {

//   const {id}= req.body;
//  // console.log("I reached here: "+username);
//   // find if there is patient with this username
//   try {
//    const Pres = await Prescription.findOne({ _id: id })
    
//          if(Pres){
//           Pres.isFilled = true;
//          return res.status(200).json({
//            success: true,
//            data: Pres,
//            message: "IsFilled updated successfully",
//          });
//       } else {
//         return res.status(404).json({
//           success: false,
//           data: null,
//           message: "Prescription not found",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         data: null,
//         message:
//           error.message || "Some error occurred while retrieving Prescription.",
//       });
//     }


    

// }

const setTakenForPres = async (req, res) => {

  const {medicines,username}= req.body;
 // console.log("I reached here: "+username);
  // find if there is patient with this username
  try {
    const patient = await getPatient(username);
        if (patient) {
            const prescriptionIDs = patient.perscreption_ids;
            let prescriptions =[]

            for(let i=0; i<prescriptionIDs.length; i++){
                
              let prescription = await Prescription.findOne({ _id: prescriptionIDs[i].prescription_id });

              console.log(prescription);
            //  if(prescription.isFilled === false){
              if(prescription.isFilled == false && prescription.PharmacySubmitStatus == true){
                prescriptions.push(prescription);
              }
            //  }
          }
          for(let i=0;i<medicines.length;i++){
            for(let j=0;j<prescriptions.length;j++){
              for(let k=0;k<prescriptions[j].medicines.length;k++){
                if(medicines[i] == prescriptions[j].medicines[k].medcineName){
                  prescriptions[j].medicines[k].taken = true;
                }
              }
            }
          }

          for(let i =0 ; i<prescriptions.length;i++){
            for(let j =0;j<prescriptions[i].medicines.length;j++){
              if(prescriptions[i].medicines[j].taken== false){
                  break;
              }
              if(j==medicines.length -1){
                prescriptions[i].isFilled==true;
              }
            }
          }
        }
        
        else {
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
          error.message || "Some error occurred while retrieving Prescription.",
      });
    }


    

}

const setIsFilledForPrescription = async (req, res) => {

  //const {id}= req.body;
 // console.log("I reached here: "+username);
  // find if there is patient with this username
  try {
   const Pres = await Prescription.findOne({ _id: id })
    
         if(Pres){
          Pres.isFilled = true;
         return res.status(200).json({
           success: true,
           data: Pres,
           message: "IsFilled updated successfully",
         });
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Prescription not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message:
          error.message || "Some error occurred while retrieving Prescription.",
      });
    }


    

}

  module.exports = {
    sendPrescriptionMedicinesToPharmacy,setIsFilledForPrescription
  };
  