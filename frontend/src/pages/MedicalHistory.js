import React, { useState, useEffect } from "react";
import axios from "axios";

const MedicalHistory = () => {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);

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
      await axios.post(`http://localhost:8000/patients/p8two/healthrecords`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Optionally, you can do something after successful upload
      alert("File uploaded successfully!");
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error.message);
      alert("File upload failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get("http://localhost:8000/patient/p8two");
        setEmail(response.data.data.email);
      } catch (error) {
        console.error("Error fetching patient:", error.message);
      }
    };

    fetchPatient();
  }, []);

  return (
    <div>
      <h1>Medical History</h1>

      {email && <p>Patient's Email: {email}</p>}

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default MedicalHistory;
