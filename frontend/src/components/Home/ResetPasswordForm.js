import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import validator from 'validator'




function App() {
    const navigate = useNavigate();
    const location = useLocation();
    let email;
    if(location.state!=null)
        email = location.state.passEmail;
    const [colorValue, setColorValue] = useState('');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        email:''
    });
    
    const [errors, setErrors] = useState({});
    const [invalid, setInvalid] = useState(false);
    const [valid, setValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setInvalid(false);
        setValid(false);
        const validationErrors = await validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
          // Submit the form or perform further actions here
          console.log('Form submitted:', formData);
        } else {
          setErrors(validationErrors);
        }
    };

    const validateForm = async (data) => {
        const errors = {};
        if (!data.password) {
            errors.password = 'Password is required';
        }
        else if (!validator.isStrongPassword(data.password, { 
            minLength: 8, minLowercase: 1, 
            minUppercase: 1, minNumbers: 1, minSymbols: 1 
            })) {
            errors.password = 'Password does not match required format';
        }
        else if (!data.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        }
        else if (data.password !==  data.confirmPassword){
            setInvalid(true);
            setErrors({});
            setErrorMessage("Passwords do not match");
        }
        else{
            try{
                data.email = email;
                const response = await fetch('/account/resetPassword', {method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),});
    
                const json = await response.json();
              
                if(response.ok){
                     // Update the state with the fetched data
                    setFormData({
                        password: '',
                        confirmPassword: ''
                    });
                    setValid(true);
                    setErrors({});
                    setErrorMessage(json.message + ". Go back to home page");
                    navigate('/');
                }
                else{
                    setInvalid(true);
                    setFormData({
                        password: '',
                        confirmPassword: ''
                    });
                    setErrors({});
                    setErrorMessage(json.message);
                }
                  
            }catch(error){
                console.error('Error fetching data:', error);
            }
        }
        return errors;
    };

  return (
    <MDBCard style={{width:540, height:600, left:'440px', top: '30px'}}>
    <MDBRow >
        <MDBCol >
        <MDBCardBody className='d-flex flex-column'>

            <div className='d-flex flex-row mt-2'>
            {/* <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/> */}
            <span className="h1 fw-bold mb-0">Password Reset</span>
            </div>

            <h5 className="fw-normal my-4 pb-1" style={{letterSpacing: '1px'}}>Choose a new password for your acount</h5>
            <h6>The password must contain the following:</h6>
            <li>At least one capital letter</li>
            <li>At least one number</li>
            <li>At least one special character(@,#,..)</li>
            <li>Minimum length of 8 characters</li>
            
            <br/>
            <TextField
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                style={{ width:500, height:30, marginBottom: '20px' }}
            />
            <br />
            <TextField
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                style={{width:500, height:30, marginBottom: '20px', marginTop: '5px' }}
            />
            <br/>
            <br/>
            {/* <MDBInput wrapperClass='mb-4' label='Username' id='formControlLg' type='username' size="lg"/>
            <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg"/> */}

            {invalid && <h6 style={{color:'red'}} >{errorMessage}</h6>}
            {valid && <h6 style={{color:'blue'}} >{errorMessage}</h6>}
            <Button  style={{ width:485}} color='dark' size='lg' onClick={handleLogin}>Reset Password</Button>
         

        </MDBCardBody>
        </MDBCol>

    </MDBRow>
    </MDBCard>
  );
}

export default App;