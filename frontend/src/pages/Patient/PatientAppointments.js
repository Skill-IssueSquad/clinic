import NavBar from "../../components/navBar";
import React from "react";
import AppointmentsMulti from "../../components/Patient/PatientAppointmentMulti";
import { auth } from "../Protected/AuthProvider";

function PatientAppointments() {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div>
      {show ? (
        <div className="PatientDoctors">
          <NavBar name={"Patient Dashboard"} username={localStorage.getItem("username")} />
          <h2>Appointments</h2>
          <AppointmentsMulti
            columns={["type", "status", "date", "doctor_name"]}
            API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem("username")}/appointments`}
          />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientAppointments;
