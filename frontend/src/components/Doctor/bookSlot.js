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
import { useNavigate } from "react-router-dom";
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

const DayTimeSlotSelector = ({
  username,
  patientId,
  appID,
  type,
  isFollowUp,
}) => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };
  useEffect(() => {
    const f = async (event) => {
      if (selectedDay === "") {
        setMessage("Please select a day");
        setSlots([]);
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
    f();
  }, [selectedDay]);

  const handleRowClick = async (slot) => {
    const currentDate = new Date();
    const chosenSlot = new Date(`${slot.day} ${slot.timeSlot}`);
    //console.log(chosenSlot);
    if (chosenSlot < currentDate) {
      setMessage("Selected slot is in the past");
      return;
    }
    const response = await fetch(`/doctor/addAppointment/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: slot.day,
        timeSlot: slot.timeSlot,
        type,
        startTime: slot.startTime,
        patientId,
        appID,
        isFollowUp,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      slots.forEach((s) => {
        if (s._id === slot._id) {
          console.log("The S is : ", s);
          console.log("The slot is : ", slot);
          s.isBooked = true;
          s.patientName = data.data.name;
          s.appointmentType = data.data.type;
        }
        if (
          s.timeSlot === data.data.oldSlot &&
          s.day === data.data.oldDay &&
          !isFollowUp
        ) {
          s.isBooked = false;
          s.patientName = "";
          s.appointmentType = "";
        }
      });
    }
    setMessage(data.message);
    if (data.success) {
      setTimeout(() => {
        navigate("/Doctor_Home");
      }, 5000); // 30 seconds
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

        {/* <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={search}>
            Show schedule
          </Button>
        </Grid> */}
      </Grid>
      <br />
      <div style={{ maxWidth: 350 }}>
        {slots && (
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Time Slot</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow
                    key={slot._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: !slot.isBooked ? "pointer" : "default",
                    }}
                    onClick={() => !slot.isBooked && handleRowClick(slot)}
                  >
                    <TableCell>{slot.timeSlot}</TableCell>
                    <TableCell>{slot.patientName}</TableCell>
                    <TableCell>{slot.appointmentType}</TableCell>
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
