//import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  NavBar,
  PrescriptionsMultiLevelFilterTable,
  AddFamilyMember,
  PatientDetails,
} from "../components/";

const Patient = () => {
  const [patient, setPatient] = useState(null);
  //const [prescriptions, setPrescriptions] = useState(null);

  const submitFamMember = async (formData) => {
    //console.log(formData);
    await axios
      .patch("http://localhost:8000/patient/john_doe/addFamMember", formData)
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          return { message: res.data.message };
        } else {
          return { message: res.data.message };
        }
      })
      .catch((err) => {
        console.log(err);
        return { message: "Something went wrong" };
      });
  };

  useEffect(() => {
    //getParam();
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/john_doe").then((res) => {
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
        API_GET_URL={"http://localhost:8000/patient/john_doe/getPrescriptions"}
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
