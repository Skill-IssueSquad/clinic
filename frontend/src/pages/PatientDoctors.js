import React, { useState } from "react"; // Import React and useState

import PatientDoctorAvailibityDatePicker from "../components/PatientDoctorAvailibityDatePicker";
import PatientMultiLevel from "../components/PatientDoctorsMultiLevelGrid";
import NavBar from "../components/navBar";

function PatientDoctors() {
  const [apiUrl, setApiUrl] = useState(
    "http://localhost:8000/patient/bahyone/doctors"
  );
  const [jsonBody, setJsonBody] = useState({});

  const handleApiUrlChange = (newUrl) => {
    setApiUrl(newUrl);
  };

  const handleBodyChange = (newBody) => {
    setJsonBody(newBody);
  };

  // Create a wrapper function that calls both handleApiUrlChange and handleBodyChange
  const handleApiAndBodyChange = (newUrl, newBody) => {
    handleApiUrlChange(newUrl);
    handleBodyChange(newBody);
  };

  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} />
      <h2>Doctors</h2>
      <PatientDoctorAvailibityDatePicker onChange={handleApiAndBodyChange} />
      <PatientMultiLevel
        columns={["name", "email", "sessionPrice", "educationalBackground"]}
        API_GET_URL={apiUrl}
        reqBody={jsonBody}
      />
    </div>
  );
}

export default PatientDoctors;
