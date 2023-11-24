import React, { useState } from "react";
import axios from "axios";
import { json } from "react-router-dom";
import { Card } from "react-bootstrap";
import { MDBCard, MDBRow, MDBCol, MDBCardBody } from "mdb-react-ui-kit";
import { Button, TextField } from "@mui/material";
import validator from "validator";

const PatientRegisterationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [invalid, setInvalid] = useState(false);
  const [genderErrorMessage, setGenderErrorMessage] = useState("");
  const [dobErrorMessage, setDobErrorMessage] = useState("");
  const [gender, setGender] = useState("");
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleGender = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvalid(false);
    setValid(false);
    setErrors({});
    setGenderErrorMessage("");
    setDobErrorMessage("");
    const validationErrors = await validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form or perform further actions here
      console.log("Form submitted:", formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = async (formData) => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    }
    if (!formData.email) {
      errors.email = "Email address is required";
    }
    if (gender === "") {
      errors.gender = "Gender is required";
      setInvalid(true);
      setGenderErrorMessage("Gender is required");
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      setInvalid(true);
      setDobErrorMessage("Date of birth is required");
    }
    if (!formData.emergencyContactName) {
      errors.emergencyContactName = "Name is required";
    }
    if (!formData.emergencyContactNumber) {
      errors.emergencyContactNumber = "Mobile number is required";
    }
    if (
      formData.password &&
      !validator.isStrongPassword(formData.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      errors.password = "Password does not match format";
    }
    if (formData.email && !validator.isEmail(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (
      formData.mobileNumber &&
      !validator.isMobilePhone(formData.mobileNumber)
    ) {
      errors.mobileNumber = "Mobile number is invalid";
    }
    if (
      formData.emergencyContactNumber &&
      !validator.isMobilePhone(formData.emergencyContactNumber)
    ) {
      errors.emergencyContactNumber = "Mobile number is invalid";
    }
    if (Object.keys(errors).length === 0) {
      try {
        const patient = {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: gender,
          dateOfBirth: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber,
          emergencyContact: {
            fullName: formData.emergencyContactName,
            mobileNumber: formData.emergencyContactNumber,
          },
        };

        const response = await fetch("/account/registerPatient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        });

        const json = await response.json();

        if (response.ok) {
          setErrors({});
          setValid(true);
          setFormData({
            username: "",
            name: "",
            password: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            mobileNumber: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
          });
          setGender("");
          setErrorMessage(
            "Registered successfully. Go back to home page to login."
          );
        } else {
          const msg = json.message;
          if (msg === "Username already taken") {
            errors.username = msg;
            return errors;
          } else if (msg === "Email already taken") {
            errors.email = msg;
            return errors;
          } else {
            console.log(json);
            //setErrors(json.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    return errors;
  };

  return (
    <div>
      <MDBCard style={{ width: 540, height: 730, left: "440px", top: "30px" }}>
        <MDBRow>
          <MDBCol>
            <MDBCardBody className="d-flex flex-column">
              <h3 className="h1 fw-bold mb-0">Register as a patient</h3>

              <h6
                className="fw-normal my-4 pb-1"
                style={{ letterSpacing: "1px" }}
              >
                Register now and get access to medical advice.
              </h6>
              <form onSubmit={handleSubmit}>
                <div>
                  {/* <label>Username</label> */}
                  <TextField
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    style={{ marginRight: ".5rem" }}
                  />
                  <TextField
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    style={{ marginLeft: ".5rem" }}
                  />
                  {/* <label>Real Name</label> */}
                </div>
                <br />
                <div>
                  {/* <label>Password</label> */}
                  <TextField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    style={{ marginRight: ".5rem" }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    style={{ marginLeft: ".5rem" }}
                  />
                </div>
                <br />
                <div>
                  <label style={{ marginRight: ".5rem" }}>Gender</label>
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    onChange={handleGender}
                    error={!!errors.gender}
                    style={{ marginRight: ".5rem" }}
                  />
                  Male{" "}
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    onChange={handleGender}
                    error={!!errors.gender}
                    style={{ marginRight: ".5rem" }}
                  />
                  Female
                  <label style={{ marginRight: ".5rem", marginLeft: "60px" }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                  />
                </div>
                <br />
                <div>
                  {/* <label>Mobile Number</label> */}
                  <TextField
                    label="Mobile Number"
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    style={{ marginRight: ".5rem" }}
                  />
                </div>
                {/* <label>Emergency Contact Name</label> */}
                <br />
                <div>
                  <TextField
                    label="Emergency Contact Name"
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    error={!!errors.emergencyContactName}
                    helperText={errors.emergencyContactName}
                    style={{ marginRight: ".5rem" }}
                  />
                  {/* <label>Emergency Contact Number</label> */}
                  <TextField
                    label="Emergency Contact Number"
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    error={!!errors.emergencyContactNumber}
                    helperText={errors.emergencyContactNumber}
                    style={{ marginLeft: ".5rem" }}
                  />
                </div>
                <br />

                {invalid && (
                  <h7 style={{ color: "red" }}>{genderErrorMessage}</h7>
                )}
                <br />
                {invalid && <h7 style={{ color: "red" }}>{dobErrorMessage}</h7>}
                <br />
                {valid && <h6 style={{ color: "blue" }}>{errorMessage}</h6>}
                <br />
                <Button
                  color="primary"
                  variant="contained"
                  style={{ top: "0px", left: "400px" }}
                  type="submit"
                >
                  Register
                </Button>
              </form>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </div>
  );
};

export default PatientRegisterationForm;
