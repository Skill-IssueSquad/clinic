import React, { useState, useEffect } from "react";
import axios from "axios";
import PDFViewer from "../components/pdf.js";
const MedicalHistory = () => {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);

  const params = new URLSearchParams(window.location.search);
  const isPatient = params.get("IP") === "true";

  console.log(isPatient);
  const patientUsername = params.get("PUN");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.post(
        `http://localhost:8000/patient/${patientUsername}/healthrecords`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // After successful upload, fetch and update health records
      fetchHealthRecords();

      // Optionally, you can do something after successful upload
      alert("File uploaded successfully!");
    } catch (error) {
      // Handle error
      console.log("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  const fetchHealthRecords = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/patient/${patientUsername}`
      );
      const records = response.data.data.healthRecords;
      setHealthRecords(records);
    } catch (error) {
      console.error("Error fetching health records:", error.message);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/patient/${patientUsername}`
        );
        setEmail(response.data.data.email);
        setHealthRecords(response.data.data.healthRecords);
      } catch (error) {
        console.error("Error fetching patient:", error.message);
      }
    };

    fetchPatient();
  }, []);

  const handleRemoveRecord = async (recordId) => {
    try {
      await axios.delete(
        `http://localhost:8000/patient/${patientUsername}/healthrecords/${recordId}`
      );

      // After successful removal, fetch and update health records
      fetchHealthRecords();

      // Optionally, you can do something after successful removal
      alert("Health record removed successfully!");
    } catch (error) {
      // Handle error
      console.log("Error removing health record:", error);
      alert("Health record removal failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Medical History</h1>

      {email && <p>Patient's Email: {email}</p>}

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Health Records:</h2>
      <ul>
        {healthRecords.map((record, index) => (
          <div>
            <li key={index}>
              Document Type: {record.documentType}, Document Name:{" "}
              {record.documentName}
              {isPatient && (
                <button onClick={() => handleRemoveRecord(record._id)}>
                  Remove
                </button>
              )}
            </li>
            <PDFViewer pdfUrl={record.documentUrl} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MedicalHistory;
