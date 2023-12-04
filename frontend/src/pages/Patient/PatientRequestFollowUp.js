import React from "react";
import NavBar from "../../components/navBar";
import { useParams } from "react-router-dom";
import { auth } from "../Protected/AuthProvider";
import RescheduleSlot from "../../components/Patient/PatientReschedule";
import RequestFollowUp from "../../components/Patient/PatientFollowUpRequester";

function PatientRequestFollowUp() {
  const { doctor_id, appointment_id } = useParams(); // Always call the hook

  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div className="RequestFollowUp">
      {show ? (
        <div>
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
          />

          <RequestFollowUp doctor_id={doctor_id}  appointment_id={appointment_id} />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientRequestFollowUp;
