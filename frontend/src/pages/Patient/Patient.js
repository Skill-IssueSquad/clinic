//import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import NavBar from "../../components/navBar";
import PrescriptionsMultiLevelFilterTable from "../../components/PrescriptionsMultiLevelFilterTable";
import AddFamilyMember from "../../components/Patient/addFamilyMember";
import PatientDetails from "../../components/Patient/PatientDetails";
import LinkFamilyMemberForm from "../../components/Patient/linkFamilyMemberform";
import { auth } from "./Protected/AuthProvider";

const Patient = () => {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = false;
  }

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
  }; // Empty dependency array since this function doesn't depend on any changing variables

  const linkFamMember = async (formData) => {
    try {
      const res = await axios.patch(
        "http://localhost:8000/patient/bahyone/linkFamMember",
        formData
      );
      console.log(res.data);
      return { message: res.data.message };
    } catch (error) {
      console.log(error);
      return { message: error.message };
    }
  };
  const handleCancelSubscription = async () => {
    try {
      await axios.patch(
        "http://localhost:8000/patient/bahyone/subscriptions/cancel"
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/bahyone").then((res) => {
        setPatient(res.data.data);
      });
    };

    fetchPatient();
  }, [submitFamMember, linkFamMember, handleCancelSubscription]); // Empty dependency array to run once on component mount

  if (!patient) return null;

  //if (!prescriptions) return null;

  return (
    <div>
      {show ? (
        <div className="patient">
          (<NavBar name={"Patient Dashboard"} username={"bahyone"} />
          <PatientDetails
            patient={patient}
            handleCancelSubscription={handleCancelSubscription}
          />
          <p></p>
          <Typography
            variant="h6"
            gutterBottom
            borderLeft={15}
            borderColor={"white"}
          >
            Add Family Member
          </Typography>
          <AddFamilyMember onSubmit={submitFamMember} />
          <p></p>
          <Typography
            variant="h6"
            gutterBottom
            borderLeft={15}
            borderColor={"white"}
          >
            Link Family Member account
          </Typography>
          <LinkFamilyMemberForm onSubmit={linkFamMember} />
          <p></p>
          <PrescriptionsMultiLevelFilterTable
            columns={["doctor_name", "date", "isFilled", "View Prescriptions"]}
            API_GET_URL={"http://localhost:8000/patient/bahyone/prescriptions"}
          />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

// function getParam() {
//   let { username } = useParams;
//   console.log("Here is the username: " + username);
//   return { username };
// }

export default Patient;
