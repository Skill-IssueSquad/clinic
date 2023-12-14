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

  console.log("Medicines: "+req.body.medicines);
  console.log("Username: "+req.body.username);
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

              console.log("Precriptions 0 : "+prescriptions[0]);
              console.log("Precriptions 1: "+prescriptions[1]);
            //  }
          }
           var isItTaken = false;
         // await Promise.all(
          // medicines.map(async (medicine) => {
            for(var medicine of  medicines){
              console.log("theMedicinesSent: "+medicine);
              for (let j = 0; j < prescriptions.length; j++) {
               

                for (let k = 0; k < prescriptions[j].medicines.length; k++) {
                  if (medicine === prescriptions[j].medicines[k].medicineName && prescriptions[j].medicines[k].taken === false) {
                    isItTaken = true;
                    // const prescription = await Prescription.findOneAndUpdate(
                    //   { _id: prescriptions[j]._id, "medicines.medicineName": medicine },
                    //   { $set: { "medicines.taken": true } },
                   
                    // );

                    let  prescription = await Prescription.findByIdAndUpdate(
                      { _id: prescriptions[j]._id },
                      {
                        $set: {
                          "medicines.$[elem].taken": true,
                          
                        },
                      },
                      {
                        arrayFilters: [
                          { "elem.medicineName": medicine },
                        ],
                        new: true,
                      }
                    )













    
                    prescriptions[j] = prescription;
                  }
                  if(isItTaken){
                    break;
                  }
                }
                if(isItTaken){
                  break;
                }
              }
              isItTaken = false;
           // });
            };
         // );

          // for(let i=0;i<medicines.length;i++){
          //   for(let j=0;j<prescriptions.length;j++){
          //     for(let k=0;k<prescriptions[j].medicines.length;k++){
          //       console.log("theMedicinesSent: "+medicines[i]);
          //       console.log("theMedicinesSent: "+prescriptions[j].medicines[k]);

          //       if(medicines[i] == prescriptions[j].medicines[k].medicineName){

                  
          //         //prescriptions[j].medicines[k].taken = true;
          //         const prescription = await Prescription.findOneAndUpdate(
          //           { _id: prescriptions[j]._id, "medicines.medicineName": medicines[i] },
          //           { $set: { "medicines.$.taken": true } },
          //         );

          //         prescriptions[j] = prescription;
          //         console.log("theMedicinesSentss: "+prescriptions[0].medicines);

                  
          //       }
          //     }
          //   }
          // }
         
          // for(let i =0 ; i<prescriptions.length;i++){
          //   for(let j =0;j<prescriptions[i].medicines.length;j++){
          //     if(prescriptions[i].medicines[j].taken== false){
          //         break;
          //     }
          //     if(j==medicines.length -1){
          //       //prescriptions[i].isFilled==true;
          //       const prescription = await Prescription.findOneAndUpdate(
          //         { _id: prescriptions[i]._id },
          //         { $set: { isFilled: true } }
                
          //       );

          //       prescriptions[j] = prescription;

          //     }
          //   }
          // }
        //  await Promise.all(
           // prescriptions.map(async (prescription) => 
           for(let perO of prescriptions){
              for (let j = 0; j < perO.medicines.length; j++) {
                if (perO.medicines[j].taken === false) {
                  break;
                }
                if (j === perO.medicines.length - 1) {
                  const updatedPrescription = await Prescription.findByIdAndUpdate(
                    { _id: perO._id },
                    {  isFilled: true  },
                    { new: true }
                  );


                  // let updatedPrescription   = await Prescription.findByIdAndUpdate(
                  //   { _id: prescriptions[j]._id },
                  //   {
                  //     $set: {
                  //       "medicines.$[elem].taken": true,
                        
                  //     },
                  //   },
                  //   {
                  //     arrayFilters: [
                  //       { "elem.medicineName": medicine },
                  //     ],
                  //     new: true,
                  //   }
                  // )
    
                }
              }
            }//)
          //);
    
          return res.status(200).json({
            success: true,
            data: prescriptions,
            message: "Updated prescriptions successfully",
          });

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
    sendPrescriptionMedicinesToPharmacy,setIsFilledForPrescription,setTakenForPres
  };
  