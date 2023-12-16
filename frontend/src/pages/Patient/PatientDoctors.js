import React, { useState } from "react"; // Import React and useState

import PatientDoctorAvailibityDatePicker from "../../components/Patient/PatientDoctorAvailibityDatePicker";
import PatientMultiLevel from "../../components/Patient/PatientDoctorsMultiLevelGrid";
import NavBar from "../../components/navBar";
import { auth } from "../../pages/Protected/AuthProvider";
import { Card, Typography } from "@mui/joy";
import { Box, Stack } from "@mui/material";

function PatientDoctors() {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  const [apiUrl, setApiUrl] = useState(
    `http://localhost:8000/patient/${localStorage.getItem("username")}/doctors`
  );
  const [jsonBody, setJsonBody] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApiUrlChange = (newUrl) => {
    setApiUrl(newUrl);
  };

  const handleBodyChange = (newBody) => {
    setJsonBody(newBody);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Create a wrapper function that calls both handleApiUrlChange and handleBodyChange
  const handleApiAndBodyChange = (newUrl, newBody) => {
    handleApiUrlChange(newUrl);
    handleBodyChange(newBody);
  };

  return (
    <div>
      {show ? (
        <div className="PatientDoctors">
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="90vh"
          >
            <br></br>
            <Typography level="h2">Doctors</Typography>
            <p></p>
            <Stack direction="column">
            {!loading && (
              
              <Card
                sx={{
                  width: "105ch",
                }}
              >
                <PatientDoctorAvailibityDatePicker
                  onChange={handleApiAndBodyChange}
                />


              </Card>
              
            )}

            <PatientMultiLevel
              columns={[
                "name",
                "email",
                "sessionPrice",
                "educationalBackground",
              ]}
              API_GET_URL={apiUrl}
              reqBody={jsonBody}
              loadng={setLoading}
            />
            </Stack>
          </Box>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientDoctors;
