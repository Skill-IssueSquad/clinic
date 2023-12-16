import React from "react";
import NavBar from "../../components/navBarPatient";
import { useParams } from "react-router-dom";
import { auth } from "../Protected/AuthProvider";
import RescheduleSlot from "../../components/Patient/PatientReschedule";

function PatientRescheduleSlots() {
  const { doctor_id, appointment_id } = useParams(); // Always call the hook

  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div className="RescheduleSlots">
      {show ? (
        <div>
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
          />

          <RescheduleSlot doctor_id={doctor_id}  appointment_id={appointment_id} />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientRescheduleSlots;
