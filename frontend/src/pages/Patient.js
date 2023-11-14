//import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";


import NavBar from "../components/navBar";
import PrescriptionsMultiLevelFilterTable from "../components/PrescriptionsMultiLevelFilterTable";
import AddFamilyMember from "../components/addFamilyMember";
import PatientDetails from "../components/PatientDetails";
import { auth } from "./Protected/AuthProvider";

const Patient = () => {
  let show = false;

  if (auth() && localStorage.getItem('role') === "Patient"){
    show=false;
  }
  
  const [patient, setPatient] = useState(null);

  const submitFamMember =async (formData) => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/patient/bahyone/addFamMember",
        formData
      );
      console.log(res.data);
      return { message: res.data.message };
    } catch (error) {
      console.log(error);
      return { message: error.message };
    }
  }; // Empty dependency array since this function doesn't depend on any changing variables

  useEffect(() => {
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/bahyone").then((res) => {
        setPatient(res.data.data);
      });
    };

    fetchPatient();
  }, [submitFamMember]); // Empty dependency array to run once on component mount

  if (!patient) return null;

  //if (!prescriptions) return null;

  return (
    <div>
      {show?
    (<div className="patient">
      <NavBar name={"Patient Dashboard"} />
      <PatientDetails patient={patient} />
      <p></p>
      <AddFamilyMember onSubmit={submitFamMember} />
      <p></p>
      <PrescriptionsMultiLevelFilterTable
        columns={["doctor_name", "date", "isFilled", "View Prescriptions"]}
        API_GET_URL={"http://localhost:8000/patient/bahyone/getPrescriptions"}
        />
    </div>) : 
    (<h2>No access</h2>)
    }
      </div>
  );
};

// function getParam() {
//   let { username } = useParams;
//   console.log("Here is the username: " + username);
//   return { username };
// }

export default Patient;
