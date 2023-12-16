import { useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
import PrescriptionsMultiLevelFilterTable from "../../components/PrescriptionsMultiLevelFilterTable";
import NavBar from "../../components/navBarPatient";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/material";

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
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh">
          <Typography level="h2">Prescriptions</Typography>
          <p></p>
          <PrescriptionsMultiLevelFilterTable
            columns={[
              "doctor_name",
              "date",
              "isFilled",
              "additionalMedicines",
              "View Prescriptions",
              "Download Prescription",
            ]}
            API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem(
              "username"
            )}/prescriptions`}
          />
          </Box>

        </div>
      ) : (
        <h1>Not Authorized</h1>
      )}
    </div>
  );
};

export default PatientPrescriptions;
