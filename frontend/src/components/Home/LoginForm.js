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
import CircularProgress from '@mui/material/CircularProgress';



function App() {
    const navigate = useNavigate();
    //const { setToken } = useAuth? useAuth(): {};
    const [showProgress, setShowProgress] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({});

    let validationErrors = {};

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validationErrors = errors;
        switch(name){
          case "username": validationErrors.username = ""; break;
          default: validationErrors.password = ""; break;
        }
      setErrors(validationErrors);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setShowProgress(true);
        const validationErrors = await validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
          // Submit the form or perform further actions here
          console.log('Form submitted:', formData);
        } else {
          setErrors(validationErrors);
        }
    };

    const validateForm = async (data) => {
        if (!data.username) {
            validationErrors.username = 'Username is required';
        }
        if (!data.password) {
            validationErrors.password = 'Password is required';
        }
        else if(data.password.length <8){
            validationErrors.password = 'Password should have at least 8 characters';
        }
        else{
            try{
                const response = await fetch('http://localhost:8000/account/login', {method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),});
    
                const json = await response.json();
              
                if(response.ok){
                     // Update the state with the fetched data
                    setFormData({
                    username: '',
                    password: ''
                    });
                    const role = json.role;
                    //setToken(json.data);
                    localStorage.setItem('token',json.data);
                    localStorage.setItem('role',role);
                    localStorage.setItem('username',data.username);
                    switch(role)
                    {
                      case "Admin" : navigate('/Admin'); break;
                      case "Doctor": navigate('/Doctor_Home'); break;
                      //check here
                      case "DoctorRequest": navigate('/DoctorRequest'); break;
                      default:  navigate('/patient');
                    }
                }
                else{
                    const msg = json.message;
                    if (msg === "User not found"){
                      validationErrors.username = msg;
                    }
                    else if (msg === "Password does not match") {
                      validationErrors.password = msg;
                    }
                    setShowProgress(false);
                    return validationErrors;
                }
                  
            }catch(error){
                setShowProgress(false);
                console.error('Error fetching data:', error);
            }
        }
        setShowProgress(false);
        return validationErrors;
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        // Submit the form when Enter key is pressed
        handleLogin(event);
      }
    };

  return (
    <MDBContainer className="my-4">

      <MDBCard style={{borderRadius: '5px'}}>
        <MDBRow className='g-0'>

          <MDBCol md='6'>
            <MDBCardImage src='clinicLogin.jpg' alt="login form" className='rounded-start w-100' style={{ height: '600px', borderRadius: '5px' }}/>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <MDBCardImage src='/clinicLogo.png' alt='Logo' style={{ width: '80px', height: '80px' }} />
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
                    onKeyDown={handleKeyDown}
                />
                {/* <br /> */}
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
                    onKeyDown={handleKeyDown}
                />
                {/* <br /> */}
                
              <Button className="mb-4 px-5" color='dark' size='lg' disabled={showProgress} onClick={handleLogin}> {!showProgress && "Login"} 
              {showProgress && <CircularProgress color="inherit" size={15}/>}  
              </Button>
              <a className="small text-muted" href="/ForgotPassword"><u> Forgot password? </u></a>   
              <br/>          
              <p className="mb-5 pb-lg-2" style={{color: '#000000'}}>Don't have an account? 
               {' '}<a href="/PatientRegisteration"  style={{color: '#393fDD'}}> <u> Register as a patient </u></a> 
                  <a>|</a>
               {' '} <a href="/DoctorRegisteration" style={{color: '#393fDD'}}> <u> Register as a doctor </u></a> 
              </p>

              <div className='d-flex flex-row justify-content-start'>
                <a className="small text-muted me-1">Terms of use | </a>
                <a className="small text-muted"> Privacy policy</a>
              </div>

            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;