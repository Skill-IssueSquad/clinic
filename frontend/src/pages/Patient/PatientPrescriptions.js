import { useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
import PrescriptionsMultiLevelFilterTable from "../../components/PrescriptionsMultiLevelFilterTable";
import NavBar from "../../components/navBarPatient";
const PatientPrescriptions = () => {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  useEffect(() => {}, []);

  return (
    <div>
      {show ? (
        <div>
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
            button = {"Prescriptions"}
          />
          <PrescriptionsMultiLevelFilterTable
            columns={[
              "doctor_name",
              "date",
              "isFilled",
              "View Prescriptions",
              "Download Prescription",
            ]}
            API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem(
              "username"
            )}/prescriptions`}
          />
        </div>
      ) : (
        <h1>Not Authorized</h1>
      )}
    </div>
  );
};

export default PatientPrescriptions;
