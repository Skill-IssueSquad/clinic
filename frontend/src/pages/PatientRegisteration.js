import React, { useEffect, useState } from "react";
import PatientRegisterationForm from "../components/patientRegisterationForm";
import { json } from "react-router-dom";

const PatientRegisteration = () => {
  const [patients, setPatients] = useState(null);

  useEffect(() => {
    const fetchpatients = async () => {
      const response = await fetch("http://localhost:8000/register/patient");
      const data = await response.json();

      if (response.ok) {
        setPatients(data.data);
      }
    };

    try {
      fetchpatients();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="main page">
      <h1>Patient Registeration</h1>

      <PatientRegisterationForm />

      <div>
        {patients &&
          patients.map((patient) => (
            <div key={patient._id}>
              <h3>{patient.name}</h3>
              <p>{patient.email}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientRegisteration;
