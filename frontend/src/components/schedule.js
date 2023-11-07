import React, { useState } from "react";
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

const timeSlots = [
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const DayTimeSlotSelector = ({ username }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const search = async (event) => {
    if (selectedDay === "") {
      setMessage("Please select a day");
      return;
    }
    const response = await fetch(`/doctor/schedule/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day: selectedDay }),
    });
    const data = await response.json();
    console.log(data.data);
    if (!data.success) {
      setSlots([]);
      setMessage(data.message);
    } else {
      setSlots(data.data);
      setMessage("");
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="date"
            label="Select Day"
            InputLabelProps={{ shrink: true }}
            onChange={(event) => setSelectedDay(event.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={search}>
            Show schedule
          </Button>
        </Grid>
      </Grid>
      <div style={{ maxWidth: 250 }}>
        {slots && (
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Time Slot</TableCell>
                  <TableCell>Patient Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow
                    key={slot._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{slot.timeSlot}</TableCell>
                    <TableCell>{slot.patientName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <p>{message}</p>
    </div>
  );
};

export default DayTimeSlotSelector;
