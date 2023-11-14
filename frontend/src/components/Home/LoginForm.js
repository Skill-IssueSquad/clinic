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
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import ForgotPassword from "./ForgotPasswordDialouge";
import { useAuth } from '../../pages/Protected/AuthProvider';


function App() {
    const navigate = useNavigate();
    //const { setToken } = useAuth? useAuth(): {};


    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
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
        if (!data.username) {
            errors.username = 'Username is required';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        }
        else if(data.password.length <8){
            errors.password = 'Password should have at least 8 characters';
        }
        else{
            try{
                const response = await fetch('/account/login', {method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),});
    
                const json = await response.json();
              
                if(response.ok){
                     // Update the state with the fetched data
                     const username = data.username;
                    setFormData({
                    username: '',
                    password: ''
                    });
                    const role = json.role;
                    //setToken(json.data);
                    localStorage.setItem('token',json.data);
                    localStorage.setItem('role',role);
                    switch(role)
                    {
                        case "Admin" : navigate('/Admin'); break;
                        case "Doctor": navigate('/Doctor_Home'); break;
                        //check here
                        case "DoctorRequest": navigate('/DoctorRequest' ,{replace:true, state: {username}}); break;
                        default:  navigate('/patient');
                    }
                }
                else{
                    const msg = json.message;
                    if (msg === "User not found"){
                        errors.username = msg;
                    }
                    else if (msg === "Password does not match") {
                        errors.password = msg;
                    }
                    return errors;
                }
                  
            }catch(error){
                console.error('Error fetching data:', error);
            }
        }
        return errors;
    };

  return (
    <MDBContainer className="my-4">

      <MDBCard>
        <MDBRow className='g-0'>

          <MDBCol md='6'>
            {/* <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100'/> */}
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>

              <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    fullWidth
                    style={{ marginBottom: '20px', marginTop: '5px' }}
                />
                <br />
                <TextField
                    type="password"
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />
                <br />
                {/* <MDBInput wrapperClass='mb-4' label='Username' id='formControlLg' type='username' size="lg"/>
                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg"/> */}

              <Button className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>Login</Button>
              <a className="small text-muted" href="/ForgotPassword"><u> Forgot password? </u></a>             
              <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? 
               {' '}<a href="/PatientRegisteration"  style={{color: '#393f81'}}> <u> Register as a patient </u></a> 
                  <a>|</a>
               {' '} <a href="/DoctorRegisteration" style={{color: '#393f81'}}> <u> Register as a doctor </u></a> 
              </p>

              <div className='d-flex flex-row justify-content-start'>
                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                <a href="#!" className="small text-muted">Privacy policy</a>
              </div>

            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;