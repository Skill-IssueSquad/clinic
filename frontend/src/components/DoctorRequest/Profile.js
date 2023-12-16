import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Avatar,
  TextField,
  IconButton,
  Card,
  Box,
} from "@mui/material";
import NavBar from "../../components/navBarDoctor"
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate ,} from "react-router-dom";
import { useLocation } from "react-router-dom";
const validator = require("validator");



const UserProfile = () => {
  let show = false;
  const location = useLocation();
  const [selectedID, setSelectedID] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showProgress, setShowProgress] = useState(false);


    let username;
    if(location.state!=null){
        username = location.state.username;
        localStorage.setItem('username', username);
    }
    else{
        username = localStorage.getItem('username');
    }



  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);
  const [oldDoctor, setOldDoctor] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [contractAccepted, setContractAccepted] = useState(false);

  const [invalid, setInvalid] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const f = async () => {
      try {
        console.log(username);
        const response = await fetch('/doctorRequest/viewInfo' , {method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({username}),});

        const json = await response.json();

        if(response.ok){
            const data = json.data[0];
            const Doctor = {
            ...data,
            };
            console.log("doctor:", Doctor);
            console.log("data:", data);
            setWalletBalance(Doctor.walletBalance);
    
            setContractAccepted(Doctor.contractAccepted);
            //console.log("Doctor: ", Doctor);
            setUser(Doctor);
            setOldDoctor(Doctor);
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };
    f();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

   const handleIDChange = (event) => {
        const file = event.target.files[0];
        setSelectedID(file);
    };

    const handleLicenseChange = (event) => {
        const file = event.target.files[0];
        setSelectedLicense(file);
    };

    const handleDegreeChange = (event) => {
        const file = event.target.files[0];
        setSelectedDegree(file);
    };

     const handleUploadDocuments = async () => {
        try {
            setShowProgress(true);
            setInvalid(false);
            setValid(false);
            if(selectedID===null || selectedLicense===null || selectedDegree===null){
                setShowProgress(false);
                setInvalid(true);
                setErrorMessage("Choose all documents");
                return;
            }

            const formData = new FormData();
            formData.append('documents', selectedID);
            formData.append('documents', selectedLicense);
            formData.append('documents', selectedDegree);

            const response = await axios.patch('http://localhost:8000/doctorRequest/updateInfo/' + username, formData, {
                withCredentials: true,
              });


            console.log(response)
              const json = response.data.data;
            if(response){
                setShowProgress(false);
                setValid(true);
                setErrorMessage("Uploaded Successfully");
                console.log("updated");
            }
            else{
                setShowProgress(false);
                setInvalid(true);
                setErrorMessage(json.message);
                console.log("Failed to upload. Please try again.");
            }

        } catch (error) {
            setShowProgress(false);
            setInvalid(true);
            setErrorMessage(error);
            console.log(error);
        }
    }


  return (
    <div>
     
            <Container maxWidth="md">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Avatar
                //   alt={user.name}
                  src={"/static/images/doc2.png"}
                  sx={{ width: 150, height: 150, marginRight: "10px" }}
                />
                
              </div>
              <br />
              <Typography variant="h4" align="center" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                {`Username: ${user.username}`}
              </Typography>

              <Typography variant="body1" align="center" gutterBottom>
                {`Email: ${user.email}`}
              </Typography>

              <Typography variant="body1" align="center" gutterBottom>
                {`Date of Birth: ${user.dateOfBirth}`}
              </Typography>

              <Typography variant="body1" align="center" gutterBottom>
                {`Hourly rate: ${user.hourlyRate}`}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                {`Hospital: ${user.affiliatedHospital}`}
              </Typography>

              <Typography variant="body1" align="center" gutterBottom>
                {`Educational Background: ${user.educationalBackground}`}
              </Typography>

              <Typography variant="body1" align="center" gutterBottom>
                {`Status: ${user.status}`}
              </Typography>

              <div style={{ textAlign: "center" }}>
                {isEditing ? (""
                ) : (
                  <IconButton color="primary" onClick={handleEditClick}>
                    <EditIcon />
                  </IconButton>
                )}
              </div>
                {isEditing && <div>
                  <Typography variant="body1" align="left" gutterBottom style={{fontWeight: 'bold', marginLeft: '300px'}}>
                    ID   
                    <input type="file" onChange={handleIDChange} style={{marginLeft:'10px'}}/>
                    </Typography>
                    <Typography variant="body1" align="left" gutterBottom style={{fontWeight: 'bold', marginLeft: '260px'}}>
                     License
                    <input type="file" onChange={handleLicenseChange} style={{marginLeft:'10px'}} />
                    </Typography>
                    <Typography variant="body1" align="left" gutterBottom style={{fontWeight: 'bold', marginLeft: '265px'}}>
                     Degree
                    <input type="file" onChange={handleDegreeChange} style={{marginLeft:'10px'}} />
                    </Typography>
                    <br/>
                    {invalid && <h6 style={{color:'red', fontWeight:'bold', marginLeft:'360px'}} >{errorMessage}</h6>}
                    {valid && <h6 style={{color:'blue',  fontWeight:'bold', marginLeft:'360px'}} >{errorMessage}</h6>}
                    <Button  color="primary" variant="contained" style={{top:'0px', left:'350px'}} onClick={handleUploadDocuments} disabled={showProgress}>
                    {!showProgress && "Upload Documents"}
                    {showProgress && <CircularProgress color="inherit" size={25} style={{marginLeft:'60px', marginRight:'60px'}}/>}
                    </Button>
                </div>}
              
              <br />
            </Container>
          
    </div>
  );
};

export default UserProfile;
