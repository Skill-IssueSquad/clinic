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

const DayTimeSlotSelector = () => {
  const [selectedDay, setSelectedDay] = useState("");

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
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
          <Button
            variant="contained"
            color="primary"
            // onClick={
            // }
          >
            Show schedule
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DayTimeSlotSelector;
