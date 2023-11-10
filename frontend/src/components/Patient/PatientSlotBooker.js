import React, { useState, useEffect } from "react";
import {
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
import axios from "axios";
import CircularProgress from "@mui/joy/CircularProgress";

let bookingOptions = [];

const SlotBooker = ({ doctor_id }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    applyFilters();
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
    applyFilters();
  };

  const clearFilters = () => {
    setSelectedDay("");
    setSelectedTimeSlot("");
    setSlots(originalData);
  };

  const applyFilters = () => {
    const filteredSlots = originalData.filter((slot) => {
      // Filter by day
      const filterDay =
        !selectedDay || slot.availableSlot.day.startsWith(selectedDay);

      // Filter by timeSlot
      const filterTimeSlot =
        !selectedTimeSlot ||
        (Number(slot.availableSlot.timeSlot.split(":")[0]) ===
          Number(selectedTimeSlot.split(":")[0]) &&
          Number(slot.availableSlot.timeSlot.split(":")[1]) ===
            Number(selectedTimeSlot.split(":")[1]));

      return filterDay && filterTimeSlot;
    });

    const sortedSlots = filteredSlots.sort((a, b) => {
      const dateA = new Date(
        `${a.availableSlot.day} ${a.availableSlot.timeSlot}`
      );
      const dateB = new Date(
        `${b.availableSlot.day} ${b.availableSlot.timeSlot}`
      );

      return dateA - dateB;
    });

    setSlots(sortedSlots);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedSlots = await axios.get(
        "http://localhost:8000/patient/freeAppointments",
        {
          params: {
            doctor_id: doctor_id,
          },
        }
      );

      let bookOptions = await axios.get(
        "http://localhost:8000/patient/bahyone/bookingOptions"
      );

      bookingOptions = bookOptions.data.data;

      let sortedData = fetchedSlots.data.data.sort((a, b) => {
        const dateA = new Date(
          `${a.availableSlot.day} ${a.availableSlot.timeSlot}`
        );
        const dateB = new Date(
          `${b.availableSlot.day} ${b.availableSlot.timeSlot}`
        );

        return dateA - dateB;
      });

      sortedData = sortedData.filter((slot) => {
        const date = new Date(
          `${slot.availableSlot.day} ${slot.availableSlot.timeSlot}`
        );
        const currentDate = new Date();
        return date >= currentDate;
      });

      setOriginalData(sortedData);
      setSlots(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctor_id]);

  useEffect(() => {
    applyFilters();
  }, [selectedDay, selectedTimeSlot, originalData]);

  const handleRowClick = async (slot) => {
    const currentDate = new Date();
    const chosenSlot = new Date(
      `${slot.availableSlot.day} ${slot.availableSlot.timeSlot}`
    );
    if (chosenSlot < currentDate) {
      setMessage("Selected slot is in the past");
      return;
    }

    // Handle booking logic here
  };

  return (
    <div>
      {loading && <CircularProgress variant="solid" />}
      {!loading && slots.length > 0 && (
        <h2>Dr. {slots[0].doctor_name}'s Slots</h2>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="date"
            label="Select Day"
            InputLabelProps={{ shrink: true }}
            onChange={handleDayChange}
            value={selectedDay}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="time"
            label="Select TimeSlot"
            InputLabelProps={{ shrink: true }}
            onChange={handleTimeSlotChange}
            value={selectedTimeSlot}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
      <br />
      <div style={{ maxWidth: 400 }}>
        {!loading && slots.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell>TimeSlot</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot._id}>
                    <TableCell>{slot.availableSlot.day}</TableCell>
                    <TableCell>{slot.availableSlot.timeSlot}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRowClick(slot)}
                      >
                        Book
                      </Button>
                    </TableCell>
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

export default SlotBooker;
