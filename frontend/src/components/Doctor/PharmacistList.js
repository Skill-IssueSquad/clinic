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
import Loading from "../Loading";
const PatientList = ({ username }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const f = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:8001/getPharmacist", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      setPatients(data.data);
      setLoading(false);
    };
    f();
  }, []);
  const chat = (patient) => {
    //console.log(username);
    window.location.href = `http://localhost:3001/chatDoctor?doctorUN=${localStorage.getItem("username")}&patientUN=${patient.username}`;
  };
  return (
    <div>
      <h1>Chat with pharmacist</h1>
      <div style={{ maxWidth: 450 }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 450 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>pharmacist Name</TableCell>
                <TableCell>Chat</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <p>Loading...</p>
            ) : (
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
            )}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PatientList;