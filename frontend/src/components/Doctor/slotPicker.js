import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Button,
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

const DayTimeSlotSelector = ({
  username,
  slots,
  setSlots,
  selectedDay2: selectedDay,
  setSelectedDay2: setSelectedDay,
  selectedDay1: scheduleDay,
}) => {
  // const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  const handleAddClick = async () => {
    if (selectedDay === "" || selectedTimeSlot === "") {
      setMessage("Please select a day and a time slot");
      return;
    }
    const currentDate = new Date();
    const chosenSlot = new Date(`${selectedDay} ${selectedTimeSlot}`);
    //console.log(chosenSlot);
    if (chosenSlot < currentDate) {
      setMessage("Selected slot is in the past");
      return;
    }

    const response = await fetch(`/doctor/addSlot/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ day: selectedDay, timeSlot: selectedTimeSlot }),
    });
    const data = await response.json();
    if (data.success) {
      setMessage("Slot added successfully");
      setSelectedTimeSlot("");
      if (selectedDay === scheduleDay) {
        const slot = {
          day: selectedDay,
          timeSlot: selectedTimeSlot,
          startTime: new Date(`${selectedDay} ${selectedTimeSlot}`),
          appointmentType: "",
          patientName: "",
        };
        const newSlots = [...slots, slot].sort((a, b) => {
          return a.startTime - b.startTime;
        });

        setSlots(newSlots);
      }
    } else {
      setMessage(data.message);
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
          <TextField
            label="Time Slot"
            select
            name="timeSlot"
            value={selectedTimeSlot}
            onChange={handleTimeSlotChange}
            SelectProps={{
              native: true,
            }}
            style={{ width: "170px" }}
          >
            <option value=""></option>
            {timeSlots.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddClick}>
            Add
          </Button>
        </Grid>
      </Grid>
      <p>{message}</p>
    </div>
  );
};

export default DayTimeSlotSelector;
