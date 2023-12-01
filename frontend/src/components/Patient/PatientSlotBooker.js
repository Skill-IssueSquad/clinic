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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/joy/CircularProgress";
import { auth } from "../../pages/Protected/AuthProvider";

let bookingOptions = [];

const SlotBooker = ({ doctor_id }) => {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedPatient, setSelectedPatient] = useState({
    patient_name: null,
  });

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectedPatient = (patient) => {
    setSelectedPatient(patient);
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
        `http://localhost:8000/patient/${localStorage.getItem(
          "username"
        )}/bookingOptions`
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

  const handleRowClick = (slot) => {
    handleOpenDialog();
    setSelectedSlot(slot);
  };

  const handleBook = async () => {
    try {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:8000/patient/${localStorage.getItem(
            "username"
          )}/bookAppointment`,
          {
            doctor_id: selectedSlot._id,
            patient_id: selectedPatient.patient_id,
            day: selectedSlot.availableSlot.day,
            timeSlot: selectedSlot.availableSlot.timeSlot,
            startTime: selectedSlot.availableSlot.startTime,
            national_id: selectedPatient.national_id,
            slot_id: selectedSlot.availableSlot._id,
            patient_name: selectedPatient.patient_name,
          }
        );

        if (response.data.success) {
          if (response.data.success) {
            handleCloseDialog();
            setMessage(response.data.message || "Slot booked successfully");
          }
        } else {
          handleCloseDialog();
          setMessage(response.data.message || "Slot booking failed");
        }
      } catch (err) {
        handleCloseDialog();
        setMessage(err.message || "Slot booking failed");
      }

      fetchData();
    } catch (error) {
      console.error("Error booking slot:", error);
    } finally {
      setLoading(false);
    }

    // Handle booking logic here
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {show ? (
        <div>
          <p></p>
          {slots.length > 0 ? (
            <h2>Dr. {slots[0].doctor_name}'s Slots</h2>
          ) :
          (
            <h2>Loading Slots</h2>
          )
          }
          <div>
            <p> Choose a suitable date to book your appointment. </p>  
          </div>
          <Grid container spacing={2}>
            <Grid item xs={4.5}>
              <TextField
                type="date"
                label="Select Day"
                InputLabelProps={{ shrink: true }}
                onChange={handleDayChange}
                value={selectedDay}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="time"
                label="Select TimeSlot"
                InputLabelProps={{ shrink: true }}
                onChange={handleTimeSlotChange}
                value={selectedTimeSlot}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
          <br />
          {!loading && <p>{message}</p>}
          {loading && <CircularProgress variant="solid" />}
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
                      <TableRow key={slot.availableSlot._id}>
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

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Slot Booking</DialogTitle>
            <DialogContent>
              <DialogTitle>Choose a patient to book for</DialogTitle>
              <List>
                {bookingOptions.map((option) => (
                  <ListItem key={option.patient_name}>
                    <ListItemText
                      primary={`Name: ${option.patient_name}`}
                      secondary={
                        option.relation !== ""
                          ? `Relation: ${option.relation}, link-type: ${option.type}`
                          : `link-type: ${option.type}`
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={
                          selectedPatient.patient_name ===
                            option.patient_name &&
                          selectedPatient.patient_name !== null
                        }
                        onClick={() => handleSelectedPatient(option)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleBook();
                }}
                variant="contained"
                color="primary"
              >
                Book
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div>
          <p>Only patients can book slots</p>
        </div>
      )}
    </div>
  );
};

export default SlotBooker;
