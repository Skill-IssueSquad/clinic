import React, { useState, useEffect } from "react";
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
  const handelAccept = async (patient) => {};

  return (
    <div>
      <h1>Chat with patients</h1>
      <div style={{ maxWidth: 550 }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Chat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((patient) => (
                <TableRow
                  key={request._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handelAccept(patient)}
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
