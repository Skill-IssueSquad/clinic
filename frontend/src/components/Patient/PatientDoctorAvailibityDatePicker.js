import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import DateTime from "react-datetime";
import Button from "@mui/material/Button";

function convertDateFormat(originalDateString) {
  // Parse the original date string into a Date object
  const originalDate = new Date(originalDateString);

  // Create a function to pad a number with leading zeros (for formatting)
  function pad(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }

  // Format the Date object to the desired format
  const formattedDateString =
    originalDate.getUTCFullYear() +
    "-" +
    pad(originalDate.getUTCMonth() + 1) + // Month is zero-based, so add 1
    "-" +
    pad(originalDate.getUTCDate()) +
    "T" +
    pad(originalDate.getUTCHours()) +
    ":" +
    pad(originalDate.getUTCMinutes()) +
    ":00.000+00:00";

  return formattedDateString;
}

const PatientDoctorAvailabilityDatePicker = ({ onChange }) => {
  const [newUrl, setNewUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [oldUrl, setOldUrl] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChangeUrl = () => {
    setOldUrl(newUrl);
    onChange("http://localhost:8000/patient/bahyone/doctors/available");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChooseDate = () => {
    setShowDatePicker(true);
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
    onChange("http://localhost:8000/patient/bahyone/doctors", {});
  };

  return (
    <div>
      {/* <TextField
        type="text"
        label="Enter new API URL"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
      /> */}
      {showDatePicker ? (
        <div className="modern-datepicker">
          <DateTime
            value={selectedDate}
            onChange={handleDateChange}
            inputProps={{ className: "form-control" }}
          />
          <button
            className="btn btn-primary"
            onClick={() =>
              onChange(
                "http://localhost:8000/patient/bahyone/doctors/available",
                { datetime: convertDateFormat(selectedDate) }
              )
            }
          >
            View Available Doctors
          </button>
          <button className="btn btn-secondary" onClick={handleCloseDatePicker}>
            Close Date Picker
          </button>
        </div>
      ) : (
        <Button variant="outlined" onClick={handleChooseDate}>
          Check Doctors Available By Specific Date
        </Button>
      )}
      {oldUrl && <p>Old URL: {oldUrl}</p>}
    </div>
  );
};

export default PatientDoctorAvailabilityDatePicker;
