import NavBar from "../../components/navBarPatient";
import React from "react";
import AppointmentsMulti from "../../components/Patient/PatientAppointmentMulti";
import { auth } from "../Protected/AuthProvider";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/material";

function PatientAppointments() {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div>
      {show ? (
        <div className="PatientDoctors">
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
            button = {"Appointments"}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="90vh"
          >
            <br></br>
            <Typography level="h2">Appointments</Typography>
            <p></p>
            <AppointmentsMulti
              columns={["type", "status", "date", "doctor_name"]}
              API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem(
                "username"
              )}/appointments`}
            />
          </Box>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientAppointments;
