import React, { useState, useEffect } from "react";
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
    const f = async () => {
      const initialUser = {
        name: "John Doe",
        profilePicture: "/static/images/doc2.png", // URL to the profile picture
        email: "john@example.com",
        dop: "29/4/2002",
        rate: "50$",
        hospital: "دار الفؤاد",
        education: "طب وجراحة عين شمس",
      };
      setUser(initialUser);
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
    // Save the edited user data here (e.g., make an API request)
    console.log("Saving user data", user);
    // For this example, we'll just toggle back to view mode
    setIsEditing(false);
    setTimeout(() => {
      setUser(updatedUser);
    }, 1000);
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
