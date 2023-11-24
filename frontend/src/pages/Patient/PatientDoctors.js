import React, { useState } from "react"; // Import React and useState

import PatientDoctorAvailibityDatePicker from "../../components/Patient/PatientDoctorAvailibityDatePicker";
import PatientMultiLevel from "../../components/Patient/PatientDoctorsMultiLevelGrid";
import NavBar from "../../components/navBar";
import { auth } from "../../pages/Protected/AuthProvider";

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
          <NavBar name={"Patient Dashboard"} username={localStorage.getItem("username")} />
          <h2>Doctors</h2>
          <PatientDoctorAvailibityDatePicker
            onChange={handleApiAndBodyChange}
          />
          <PatientMultiLevel
            columns={["name", "email", "sessionPrice", "educationalBackground"]}
            API_GET_URL={apiUrl}
            reqBody={jsonBody}
          />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientDoctors;
