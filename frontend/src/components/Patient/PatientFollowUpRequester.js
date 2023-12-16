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
import { useNavigate } from "react-router-dom";

let bookingOptions = [];

const RequestFollowUp = ({ doctor_id, appointment_id }) => {
  let show = false;
  const navigate = useNavigate();

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
  const [docName, setDocName] = useState("Loading slots...");
  const [Patient, setPatient] = useState({});

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
      let fetchedSlots = await axios.get(
        "http://localhost:8000/patient/freeAppointments",
        {
          params: {
            doctor_id: doctor_id,
          }, 
        }, {withCredentials: true}
      );

      setDocName(`Dr. ${fetchedSlots.data.data.doc_name}'s slots`);

      fetchedSlots = fetchedSlots.data.data.appointments;

      let patient = await axios.get(
        `http://localhost:8000/patient/${localStorage.getItem("username")}`
      );

      setPatient(patient.data.data);

      let sortedData = fetchedSlots.sort((a, b) => {
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
    setSelectedSlot(slot);
    handleBook(slot);
  };

  const handleBook = async (slot) => {
    try {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:8000/patient/${localStorage.getItem(
            "username"
          )}/tempRequestFollowUp`,
          {
            doctor_id: slot._id,
            appointment_id: appointment_id,
            date: slot.availableSlot.startTime,
            day: slot.availableSlot.day,
            slot: slot.availableSlot.timeSlot,
            slot_id: slot.availableSlot._id,
          }
        );

        if (response.data.success) {
          
            handleCloseDialog();
            //setMessage(response.data.message || "Slot reschduled successfully");
            navigate(`/patient/payment/${response.data.data.transit_id}`);
            
          
        } else {
          handleCloseDialog();
          setMessage(response.data.message || "Slot reschduling failed");
        }
      } catch (err) {
        handleCloseDialog();
        setMessage(err.message || "Slot reschduling failed");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {show ? (
        <div>
          <p></p>
          <h2>{docName}</h2>
          <div>
            <p> Choose a suitable date to request a follow-up. </p>
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
          <p></p>
          {!loading && <p>{message}</p>}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading && <CircularProgress variant="solid" />}
          </div>

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
                            Request FollowUp
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>Only patients can request follow-ups</p>
        </div>
      )}
    </div>
  );
};

export default RequestFollowUp;
