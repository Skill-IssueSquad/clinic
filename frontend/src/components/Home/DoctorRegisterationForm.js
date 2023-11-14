import React, { useState } from "react";
import axios from "axios";
import { json } from "react-router-dom";
import { MDBCard, MDBRow, MDBCol, MDBCardBody } from "mdb-react-ui-kit";
import { Button, TextField } from "@mui/material"; 
import validator from 'validator'

const DoctorRegistrationForm = () => {
  
  const [formData, setFormData] = useState({
    username: "",
      name: "",
      password: "",
      email: "",
      dateOfBirth: "",
      hourlyRate: "",
      affiliatedHospital: "",
      educationalBackground: "",
  });
  const [errors, setErrors] = useState({});
  const [invalid, setInvalid] = useState(false);
  const [dobErrorMessage, setDobErrorMessage] = useState('');
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvalid(false);
    setValid(false);
    setErrors({});
    setDobErrorMessage('');
    const validationErrors = await validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form or perform further actions here
      console.log('Form submitted:', formData);
    } else {
      setErrors(validationErrors);
    }
  };


  const validateForm = async (formData) => {
    const errors = {};

    if(!formData.name){
      errors.name = "Name is required";
    }
    if(!formData.username){
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } 
    if(!formData.email){
      errors.email = "Email address is required";
    }
    if(!formData.dateOfBirth){
      errors.dateOfBirth = "Date of birth is required";
      setInvalid(true);
      setDobErrorMessage("Date of birth is required");
    }
    if(!formData.hourlyRate){
      errors.hourlyRate = "Hourly rate is required";
    }
    else if(formData.hourlyRate<0){
      errors.hourlyRate = "Hourly rate cannot be negative";
    }
    if(!formData.affiliatedHospital){
      errors.affiliatedHospital = "Affiliated hospital is required";
    }
    if(!formData.educationalBackground){
      errors.educationalBackground = "Educational background is required";
    }
    if (formData.password && !validator.isStrongPassword(formData.password, { 
        minLength: 8, minLowercase: 1, 
        minUppercase: 1, minNumbers: 1, minSymbols: 1 
        })) {
      errors.password = 'Password does not match format';
    }
    if(formData.email && !validator.isEmail(formData.email)){
      errors.email = "Email is invalid";
    }
 
   

    if(Object.keys(errors).length===0){
      try{
        const doctor = {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          hourlyRate: formData.hourlyRate,
          affiliatedHospital: formData.affiliatedHospital,
          educationalBackground: formData.educationalBackground,
        };
    
    
        const response = await fetch('/account/registerDoctor', {method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctor),});

        const json = await response.json();

        if (response.ok) {
          setErrors({});
          setValid(true);
          setFormData({
            username: "",
            name: "",
            password: "",
            email: "",
            dateOfBirth: "",
            hourlyRate: "",
            affiliatedHospital: "",
            educationalBackground: "",
          });
          setErrorMessage("Registered successfully. Go back to home page to login.");
        } 
        else 
        {
          const msg = json.message;
          if (msg === "Username already taken"){
            errors.username = msg;
            return errors;
          }
          else if (msg === "Email already taken"){
            errors.email = msg;
            return errors;
          }
          else{
            console.log(json);
            //setErrors(json.message);    
          }
      }
      
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
    return errors;
  };

  return (
    <div>
    <MDBCard style={{width:540, height:640, left:'440px', top: '30px'}}>
    <MDBRow >
        <MDBCol >
        <MDBCardBody className='d-flex flex-column'>
            <h3 className="h1 fw-bold mb-0">Register as a doctor</h3>

            <h6 className="fw-normal my-4 pb-1" style={{letterSpacing: '1px'}}>Submit a request to join our platform</h6>
        <form onSubmit={handleSubmit}>
            <div>
            {/* <label>Username</label> */}
            <TextField
                label= "Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                style={{ marginRight: '.5rem' }}
            />
            <TextField
                label= "Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                style={{ marginLeft: '.5rem' }}
            />
            {/* <label>Real Name</label> */}
            </div>
            <br/>
            <div>
            {/* <label>Password</label> */}
            <TextField
                label= "Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                style={{ marginRight: '.5rem' }}
            />
            <TextField
                label= "Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                style={{ marginLeft: '.5rem' }}
            />
            {/* <label>Email Address</label> */}
            </div>
            <br/>
            <div>
            <label style={{ marginRight: '20px', marginTop: '18px'}} >Date of Birth</label>
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                style={{ marginRight: '.5rem' }}
            />
            <TextField
              label= "Hourly Rate"
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              error={!!errors.hourlyRate}
              helperText={errors.hourlyRate}
              style={{ marginLeft: '30px' }}
            />
            </div>
            <br/>
            <div>
              <TextField
                label="Affiliated Hospital"
                type="text"
                name="affiliatedHospital"
                value={formData.affiliatedHospital}
                onChange={handleChange}
                error={!!errors.affiliatedHospital}
                helperText={errors.affiliatedHospital}
                style={{ marginRight: '.5rem' }}
              />
              <TextField
                label="Educational Background"
                type="text"
                name="educationalBackground"
                value={formData.educationalBackground}
                onChange={handleChange}
                error={!!errors.educationalBackground}
                helperText={errors.educationalBackground}
                style={{ marginLeft: '.5rem' }}
              />
            </div>
            <br/>

            {invalid && <h7 style={{color:'red'}} >{dobErrorMessage}</h7>}
            <br/>
            {valid && <h6 style={{color:'blue'}} >{errorMessage}</h6>}
            <br/>
            <Button color="primary" variant="contained" style={{top:'0px', left:'400px'}} type="submit">Register</Button>
        </form>
        </MDBCardBody>
        </MDBCol>

    </MDBRow>
      </MDBCard>
    </div>
  );
};
export default DoctorRegistrationForm;






