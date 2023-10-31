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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppBar from "../components/appBar";
import Loading from "../components/Loading";
import Contract from "../components/employmentContract";
const validator = require("validator");

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [oldDoctor, setOldDoctor] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [adminApproved, setAdminApproved] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);

  useEffect(() => {
    const f = async () => {
      try {
        const username = "opa%20nseet%20esmy";
        const response = await axios.get(`/doctor/${username}`);
        const data = response.data.data[0];
        const Doctor = {
          ...data,
        };
        setWalletBalance(Doctor.walletBalance);
        setAdminApproved(Doctor.adminApproval);
        //console.log("Doctor: ", Doctor);
        setUser(Doctor);
        setOldDoctor(Doctor);
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

  const handleSaveClick = async () => {
    const updatedUser = user;
    setUser(null);
    if (!validator.isAlpha(updatedUser.affiliatedHospital.replace(/\s/g, ""))) {
      setError("Invalid hospital name");
      setUser(oldDoctor);
      setIsEditing(false);
      return;
    }
    if (!validator.isNumeric(updatedUser.hourlyRate.toString())) {
      setError("Invalid hourly rate");
      setUser(oldDoctor);
      setIsEditing(false);
      return;
    }
    if (!validator.isEmail(updatedUser.email)) {
      setError("Invalid email");
      setUser(oldDoctor);
      setIsEditing(false);
      return;
    }

    const username = "opa%20nseet%20esmy";

    const res = await fetch(`/doctor/update/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatedUser,
      }),
    });
    const response = await res.json();
    // console.log("response: ", response);
    if (response.success) {
      setIsEditing(false);
      setUser(response.data);
      setOldDoctor(response.data);
      setError(null);
    } else {
      // console.log("error");
      setError(response.message);
      setUser(oldDoctor);
      setIsEditing(false);
    }
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
      {/* <AppBar /> */}
      {user ? (
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
              alt={user.name}
              src={"/static/images/doc2.png"}
              sx={{ width: 150, height: 150, marginRight: "10px" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <AccountBalanceWalletIcon style={{ fontSize: 30 }} />
              <span style={{ marginLeft: "10px" }}>{walletBalance}</span>
            </div>
          </div>
          <br />
          <Typography variant="h4" align="center" gutterBottom>
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
            {isEditing ? (
              <TextField
                name="hourlyRate"
                label="hourlyRate"
                value={user.hourlyRate}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              `Hourly rate: ${user.hourlyRate}`
            )}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {isEditing ? (
              <TextField
                name="affiliatedHospital"
                label="affiliatedHospital"
                value={user.affiliatedHospital}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              `Hospital: ${user.affiliatedHospital}`
            )}
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
          <br />
          {error && <Typography variant="h6">{error}</Typography>}
          {adminApproved && !contractAccepted && !isEditing && (
            <Contract
              hourlyRate={user.hourlyRate}
              setContractAccepted={setContractAccepted}
            />
          )}
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
