import React, { useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs, Link, Typography } from '@mui/material';


function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [colorValue, setColorValue] = useState('');
    const [username, setUsername] = useState('');
    const [showProgress, setShowProgress] = useState(false);

    const handleClick = () => {
        {localStorage.setItem('selectedItem',"Dashboard")}
      }

    const breadcrumbs = [
      <Link
        underline="hover"
        key="2"
        color="grey"
        href="/Admin"
        onClick={handleClick}
      >
      {<HomeIcon style={{color: 'blue', opacity: 0.5}}></HomeIcon>}
      </Link>,
      <Typography key="3" color="grey">
        Change Password
      </Typography>,
    ];

    useEffect( () => {
        const getUsername = () => {
            setUsername(localStorage.getItem('username'));
        }
        getUsername();
    }, []);
  

    const [formData, setFormData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
        username:''
    });
    
    const [errors, setErrors] = useState({});
    const [invalid, setInvalid] = useState(false);
    const [valid, setValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    let validationErrors = {};

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validationErrors = errors;
        switch(name){
          case "password": validationErrors.password = ""; break;
          default: validationErrors.confirmPassword = ""; break;
        }
      setErrors(validationErrors);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setInvalid(false);
        setValid(false);
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
        const errors = {};
        if (!data.password) {
            validationErrors.password = 'New password is required';
        }
        else if (!validator.isStrongPassword(data.password, { 
            minLength: 8, minLowercase: 1, 
            minUppercase: 1, minNumbers: 1, minSymbols: 1 
            })) {
            validationErrors.password = 'Password does not match required format';
        }
        else if (!data.confirmPassword) {
            validationErrors.confirmPassword = 'Please confirm your new password';
        }
        else if (data.password !==  data.confirmPassword){
            setInvalid(true);
            setErrors({});
            setErrorMessage("Passwords do not match");
        }
        else{
            try{
                data.username = username;
                const response = await fetch('/account/resetPassword', {method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),});
    
                console.log("makes request");
                const json = await response.json();
                console.log(json);
              
                if(response.ok){
                     // Update the state with the fetched data
                    setFormData({
                        oldPassword: '',
                        password: '',
                        confirmPassword: '',
                        username:''
                    });
                    setValid(true);
                    setErrors({});
                    setErrorMessage(json.message);
                    setShowProgress(false);
                    //navigate('/');
                }
                else{
                    setInvalid(true);
                    setFormData({
                        oldPassword: '',
                        password: '',
                        confirmPassword: '',
                        username:''
                    });
                    setErrors({});
                    setErrorMessage(json.message);
                    setShowProgress(false);
                }
                  
            }catch(error){
                setShowProgress(false);
                console.error('Error fetching data:', error);
            }
        }
        setShowProgress(false);
        return validationErrors;
    };

  return (
    <div>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
        <MDBCard style={{width:540, height:600, left:'440px', top: '10px'}}>
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
                {invalid && <h6 style={{color:'red'}} >{errorMessage}</h6>}
                {valid && <h6 style={{color:'blue'}} >{errorMessage}</h6>}
                <Button style={{ width:485}} color='dark' size='lg' onClick={handleLogin} disabled={showProgress}>
                    {!showProgress && "Reset Password"}
                    {showProgress && <CircularProgress color="inherit" style={{marginLeft:'0px', marginTop:'0px'}} size={15} />} 
                </Button>
            </MDBCardBody>
            </MDBCol>

        </MDBRow>
        </MDBCard>
    </div>
  );
}

export default App;