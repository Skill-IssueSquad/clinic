import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const PatientList = ({ username }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const f = async () => {
      const response = await fetch(`/doctor/chat/getPatients/${username}`);
      const data = await response.json();
      console.log(data);
      setPatients(data.data);
    };
    f();
  }, []);
  const chat = (patient) => {
    navigate("/Doctor_Chat", { state: { patientID: patient.id } });
  };

  return (
    <div>
      <h1>Chat with patients</h1>
      <div style={{ maxWidth: 300 }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 300 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Chat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => chat(patient)}
                    >
                      Chat
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PatientList;
