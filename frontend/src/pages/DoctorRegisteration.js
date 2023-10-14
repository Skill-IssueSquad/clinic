import React, { useState, useEffect } from "react";
import DoctorRegisterationForm from "../components/doctorRegistrationForm";

const DoctorRegisteration = () => {
  const [doctors, setDoctors] = useState(null);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8000/register/doctor");
        const data = await response.json();

        if (response.ok) {
          setDoctors(data.data);
        } else {
          console.error("Failed to fetch doctors data");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    try {
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    //handle doctor data like patient data
    <div className="main page">
      <h1>Doctor Registeration</h1>

      <DoctorRegisterationForm />

      <div>
        {doctors &&
          doctors.map((doctor) => (
            <div key={doctor._id}>
              <h3>{doctor.name}</h3>
              <p>{doctor.email}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorRegisteration;
