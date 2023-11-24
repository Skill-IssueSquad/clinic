import React, { useState } from "react";
import axios from "axios";
import { json } from "react-router-dom";

const PatientRegisterationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    realName: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient = {
      username: formData.username,
      name: formData.realName,
      password: formData.password,
      email: formData.email,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      mobileNumber: formData.mobileNumber,
      emergencyContact: {
        fullName: formData.emergencyContactName,
        mobileNumber: formData.emergencyContactNumber,
      },
    };

    console.log(formData);
    console.log(patient);

    const response = await axios.post(
      "http://localhost:8000/register/patient",
      patient
    );

    const patientData = await json(response);

    if (!response.ok) {
      setError(patientData.message);
    } else {
      setError(null);

      setFormData({
        username: "",
        realName: "",
        password: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        mobileNumber: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
      });

      setSuccessMessage("Patient Registered Successfully");

      console.log("Patient Registered Successfully");
    }
  };

  return (
    <div>
      <form className="register patient" onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Real Name</label>
          <input
            type="text"
            name="realName"
            value={formData.realName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender</label>
          <input
            type="radio"
            name="gender"
            value="M"
            onChange={handleChange}
          />{" "}
          Male
          <input
            type="radio"
            name="gender"
            value="F"
            onChange={handleChange}
          />{" "}
          Female
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Emergency Contact Number</label>
          <input
            type="tel"
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default PatientRegisterationForm;
