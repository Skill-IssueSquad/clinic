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
const Requests = ({ username }) => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const f = async () => {
      const response = await fetch(
        `/doctor/getRequestedAppointments/${username}`
      );
      const data = await response.json();
      console.log(data);
      setRequests(data.data);
    };
    f();
  }, []);

  const handelAccept = async (request) => {
    const response = await fetch(`/doctor/acceptAppointment/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientName: request.patientName,
        day: request.day,
        slot: request.slot,
        type: request.type,
        appID: request.appID,
      }),
    });
    const data = await response.json();
    console.log(data);
    setRequests(requests.filter((req) => req._id !== request._id));
  };
  const handelReject = async (request) => {
    const response = await fetch("/doctor/revokeAppointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appID: request.appID,
      }),
    });
    const data = await response.json();
    console.log(data);
    setRequests(requests.filter((req) => req._id !== request._id));
  };
  return (
    <div>
      <h1>Appointments requests</h1>
      <div style={{ maxWidth: 550 }}>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Accept</TableCell>
                <TableCell>Reject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{request.patientName}</TableCell>
                  <TableCell>{request.day}</TableCell>
                  <TableCell>{request.slot}</TableCell>
                  <TableCell>{request.appointmentType}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handelAccept(request)}
                    >
                      Accept
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handelReject(request)}
                    >
                      Reject
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

export default Requests;
