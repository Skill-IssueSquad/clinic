import PatientDetails from "../components/PatientDetails";
//import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AddFamilyMember from "../components/addFamilyMember";

const Patient = () => {
  const [patient, setPatient] = useState(null);

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

    fetchPatient();
  }, [submitFamMember]);

  if (!patient) return null;

  return (
    <div className="patient">
      <h2>Patient</h2>
      <PatientDetails patient={patient} />
      <p></p>
      <AddFamilyMember onSubmit={submitFamMember} />
    </div>
  );
};

// function getParam() {
//   let { username } = useParams;
//   console.log("Here is the username: " + username);
//   return { username };
// }

export default Patient;
