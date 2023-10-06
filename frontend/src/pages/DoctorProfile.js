import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Avatar,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AppBar from "../components/appBar";
import Loading from "../components/Loading";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  // Replace with your user data
  useEffect(() => {
    // console.log("use effect ran");
    const f = async () => {
      try {
        const username = "opaNseetEsmy";
        const response = await axios.get(`/doctor/${username}`);
        const data = response.data.data[0];
        // console.log(data);
        const dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString();
        const Doctor = {
          name: data.name,
          email: data.email,
          dop: dateOfBirth,
          rate: data.hourlyRate,
          hospital: data.affiliatedHospital,
          education: data.educationalBackground,
        };
        // console.log(Doctor);
        setUser(Doctor);
      } catch (error) {
        console.error(error);
      }
    };
    f();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const updatedUser = user;
    setUser(null);
    const username = "opaNseetEsmy";
    const response = await axios.post(`/doctor/update/${username}`);
    console.log("response: ", response);
    setIsEditing(false);
    setUser(updatedUser);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div>
      <AppBar />
      {user ? (
        <Container maxWidth="md">
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Avatar
              alt={user.name}
              src={user.profilePicture}
              sx={{ width: 150, height: 150 }}
            />
          </div>
          <Typography variant="h4" align="center" gutterBottom>
            {/* {isEditing ? (
          <TextField
            name="name"
            label="Name"
            value={user.name}
            onChange={handleInputChange}
            fullWidth
          />
        ) : (
          `Name: ${user.name}`
        )} */}
            Name: {user.name}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {isEditing ? (
              <TextField
                name="email"
                label="Email"
                value={user.email}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              `Email: ${user.email}`
            )}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {/* {isEditing ? (
          <TextField
            name="dop"
            label="dop"
            value={user.dop}
            onChange={handleInputChange}
            fullWidth
          />
        ) : (
          `Date of birth: ${user.dop}`
        )} */}
            Date of birth: {user.dop}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {isEditing ? (
              <TextField
                name="rate"
                label="rate"
                value={user.rate}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              `Hourly rate: ${user.rate}`
            )}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {isEditing ? (
              <TextField
                name="hospital"
                label="hospital"
                value={user.hospital}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              `Hospital: ${user.hospital}`
            )}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {/* {isEditing ? (
          <TextField
            name="education"
            label="education"
            value={user.education}
            onChange={handleInputChange}
            fullWidth
          />
        ) : (
          `Education: ${user.education}`
        )} */}
            Education: {user.education}
          </Typography>
          <div style={{ textAlign: "center" }}>
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            ) : (
              <IconButton color="primary" onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            )}
          </div>
        </Container>
      ) : (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
        >
          <Loading />
        </Box>
      )}
    </div>
  );
};

export default UserProfile;
