import React from "react";
import { auth } from "../Protected/AuthProvider";
import PrescriptionsMultiLevelFilterTable from "../../components/PrescriptionsMultiLevelFilterTable";
const PatientPrescriptions = () => {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div>
      {show ? (
        <PrescriptionsMultiLevelFilterTable
          columns={["doctor_name", "date", "isFilled", "View Prescriptions"]}
          API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem(
            "username"
          )}/prescriptions`}
        />
      ) : (
        <h1>Not Authorized</h1>
      )}
    </div>
  );
};

export default PatientPrescriptions;
