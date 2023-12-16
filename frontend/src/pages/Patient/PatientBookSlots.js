import React from "react";
import NavBar from "../../components/navBarPatient";
import SlotBooker from "../../components/Patient/PatientSlotBooker";
import { useParams } from "react-router-dom";
import { auth } from "../Protected/AuthProvider";

function PatientBookSlots() {
  const { doctor_id } = useParams(); // Always call the hook

  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div className="PatientDoctors">
      {show ? (
        <div>
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
          />

          <SlotBooker doctor_id={doctor_id} />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientBookSlots;
