import MultiLevelFilterTable from "../components/MultiLevelFilterTable";
import PatientDetails from "../components/PatientDetails";
//import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Patient = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    //getParam();
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/john_doe").then((res) => {
        setPatient(res.data.data);
      });
    };

    fetchPatient();
  }, []);

  if (!patient) return null;

  return (
    <div className="patient">
      <h2>Patient</h2>
      <PatientDetails patient={patient} />
      <MultiLevelFilterTable />
    </div>
  );
};

// function getParam() {
//   let { username } = useParams;
//   console.log("Here is the username: " + username);
//   return { username };
// }

export default Patient;
