//import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NavBar from "../components/navBar";
import PrescriptionsMultiLevelFilterTable from "../components/PrescriptionsMultiLevelFilterTable";
import AddFamilyMember from "../components/addFamilyMember";
import PatientDetails from "../components/PatientDetails";

const Patient = () => {
  const [patient, setPatient] = useState(null);
  //const [prescriptions, setPrescriptions] = useState(null);

  const submitFamMember = async (formData) => {
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
  };

  useEffect(() => {
    //getParam();
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/bahyone").then((res) => {
        setPatient(res.data.data);
      });
    };

    // const fetchPrescriptions = async () => {
    //   await axios
    //     .get("http://localhost:8000/patient/john_doe/getPrescriptions")
    //     .then((res) => {
    //       setPrescriptions(res.data.data);
    //     });
    // };

    fetchPatient();
    //fetchPrescriptions();
  }, [submitFamMember]);

  if (!patient) return null;
  //if (!prescriptions) return null;

  return (
    <div className="patient">
      <NavBar name={"Patient Dashboard"} />
      <PatientDetails patient={patient} />
      <p></p>
      <AddFamilyMember onSubmit={submitFamMember} />
      <p></p>
      <PrescriptionsMultiLevelFilterTable
        columns={["doctor_name", "date", "isFilled", "View Prescriptions"]}
        API_GET_URL={"http://localhost:8000/patient/bahyone/getPrescriptions"}
      />
    </div>
  );
};

// function getParam() {
//   let { username } = useParams;
//   console.log("Here is the username: " + username);
//   return { username };
// }

export default Patient;
