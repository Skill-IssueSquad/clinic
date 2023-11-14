import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <div>
        {/* <button>
          <a href="/patientRegisteration"> Patient Registeration </a>
        </button> */}

      <Button variant="contained" color="primary">
          <a href="/patientRegisteration"> Patient Registeration </a>
      </Button>

        {/* <button>
          <a href="/doctorRegisteration"> Doctor Registeration </a>
        </button> */}

        <br></br>
        <br></br>
        <br></br>

      <Button variant="contained" color="primary">
          <a href="/doctorRegisteration"> Doctor Registeration </a>
      </Button>

      
      </div>
    </div>
  );
};

export default Home;
