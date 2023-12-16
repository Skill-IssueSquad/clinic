import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "reactjs-popup/dist/index.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import CircularProgress from "@mui/joy/CircularProgress";
import jsPDF from "jspdf";

let fullRows = [];
let testcols = [];

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

const PrescriptionsMultiLevelFilterTable = ({ columns, API_GET_URL }) => {
  const initFilter = {};
  columns.forEach((key) => {
    initFilter[key] = "";
  });
  const [filter, setFilter] = useState(initFilter);
  const [rows, setRows] = useState([]);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loading, setLoading] = useState(true); // Add a loading state
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = (
    doctor_name,
    medicines,
    date,
    additionalMedicines
  ) => {
    var doc = new jsPDF("portrait", "px", "a4", false);
    doc.setFontSize(20);
    doc.text("Prescription", 40, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Date: ", 40, 40);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(date).toLocaleDateString("fr-FR"), 100, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Name: ", 40, 50);
    doc.setFont("helvetica", "normal");
    doc.text(doctor_name, 100, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Medicines: ", 40, 70);
    doc.setFont("helvetica", "normal");
    var y = 90;
    medicines.map((medicine) => {
      doc.text("Medicine Name: " + medicine.medicineName, 40, y);
      doc.text("Dose: " + medicine.dose, 40, y + 20);
      y += 40;
    });
    doc.setFont("helvetica", "bold");
    doc.text("Additional Medicines: ", 40, y);
    doc.setFont("helvetica", "normal");
    doc.text(additionalMedicines, 40, y + 20);

    doc.save("prescription.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET_URL);
        const initialRows = response.data.data;
        fullRows = initialRows;
        fullRows.map((row) => {
          row["View Prescriptions"] = "";
          row["Download Prescription"] = "";
        });

        testcols = columns.map((col) => {
          return col.toLowerCase();
        });

        setRows(initialRows);
        console.log(rows);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [API_GET_URL]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleSort = (field) => {
    let order = "asc";

    if (sorting.field === field && sorting.order === "asc") {
      order = "desc";
    }

    setSorting({
      field,
      order,
    });

    // Sort the rows based on the field and order
    const sortedRows = [...rows].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setRows(sortedRows);
  };

  const filteredRows = rows.filter((row) => {
    let accumCond = true;

    columns.forEach((key) => {
      let rowValue = row[key];
      let filterValue = filter[key];

      let query = String(filterValue);

      //console.log(rowValue, filterValue);

      if (filterValue === undefined) {
        // Exclude the row if the filter input is empty
        return false;
      } else {
        var regexType1 = /([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 1 sided range
        var regexType2 =
          /([<>]=?)\s*(-?\d+(\.\d+)?)\s*([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 2 sided range
        var regexDate1 =
          /([><]=?)\s*(\d{4}[/-](?:[1-9]|1[0-2]|0[0-9])[/-](?:[0-2][0-9]|\d|3[10]))/;
        var regexDate2 =
          /([><]=?)\s*(\d{4}[/-](?:[1-9]|1[0-2]|0[0-9])[/-](?:[0-2][0-9]|\d|3[10]))\s*([><]=?)\s*(\d{4}[/-](?:[1-9]|1[0-2]|0[0-9])[/-](?:[0-2][0-9]|\d|3[10]))/;

        var matchType1 = query.match(regexType1);
        var matchType2 = query.match(regexType2);
        var matchDate1 = query.match(regexDate1);
        var matchDate2 = query.match(regexDate2);

        var item = parseFloat(rowValue);
        if (matchDate1 && !matchDate2) {
          console.log(matchDate1);
          var operator = matchDate1[1];
          var value = matchDate1[2];

          var date = new Date(value);
          var itemDate = new Date(rowValue);

          //console.log(date);

          // Adjust for AM/PM format
          date.setTime(0);
          itemDate.setTime(0);

          //console.log("xfy");

          accumCond =
            accumCond &&
            (operator === "<"
              ? itemDate < date
              : operator === "<="
              ? itemDate <= date
              : operator === ">"
              ? itemDate > date
              : operator === ">="
              ? itemDate >= date
              : false);
        } else if (matchDate2) {
          console.log(matchDate2);
          var operator1 = matchDate2[1];
          var value1 = matchDate2[2];
          var operator2 = matchDate2[3];
          var value2 = matchDate2[4];
          //console.log(operator1, "|", value1, "|", operator2, "|", value2);

          var date1 = new Date(value1);
          var date2 = new Date(value2);

          date1.setTime(0);
          date2.setTime(0);
          itemDate.setTime(0);

          // console.log(
          //   convertDateFormat(value1),
          //   "|",
          //   convertDateFormat(value2)
          // );
          var itemDate = new Date(rowValue);

          //Adjust for AM/PM format
          if (value1.includes("PM")) {
            date1.setHours(date1.getHours() + 12);
          }

          if (value2.includes("PM")) {
            date2.setHours(date2.getHours() + 12);
          }

          accumCond =
            accumCond &&
            (operator1 === "<"
              ? itemDate < date1
              : operator1 === "<="
              ? itemDate <= date1
              : operator1 === ">"
              ? itemDate > date1
              : operator1 === ">="
              ? itemDate >= date1
              : operator1 === "=="
              ? itemDate.getTime() === date1.getTime()
              : false) &&
            (operator2 === "<"
              ? itemDate < date2
              : operator2 === "<="
              ? itemDate <= date2
              : operator2 === ">"
              ? itemDate > date2
              : operator2 === ">="
              ? itemDate >= date2
              : false);
        } else if (matchType1 && !matchType2) {
          //console.log("bruh");
          var operator = matchType1[1];
          var value = parseFloat(matchType1[2]);

          accumCond =
            accumCond &&
            (operator === "<"
              ? item < value
              : operator === "<="
              ? item <= value
              : operator === ">"
              ? item > value
              : operator === ">="
              ? item >= value
              : operator === "=="
              ? item === value
              : false);
        } else if (matchType2) {
          var operator1 = matchType2[1];
          var value1 = parseFloat(matchType2[2]);
          var operator2 = matchType2[3];
          var value2 = parseFloat(matchType2[4]);

          accumCond =
            accumCond &&
            (operator1 === "<"
              ? item < value1
              : operator1 === "<="
              ? item <= value1
              : operator1 === ">"
              ? item > value1
              : operator1 === ">="
              ? item >= value1
              : operator1 === "=="
              ? item === value1
              : false) &&
            (operator2 === "<"
              ? item < value2
              : operator2 === "<="
              ? item <= value2
              : operator2 === ">"
              ? item > value2
              : operator2 === ">="
              ? item >= value2
              : operator2 === "=="
              ? item === value2
              : false);
        } else if (typeof rowValue === "string") {
          if (/(<|>|<=|>=)/.test(filterValue)) {
            return false;
          }
          accumCond =
            accumCond &&
            rowValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof rowValue === "number") {
          accumCond = accumCond && rowValue.toString().includes(filterValue);
        }
      }
    });

    return accumCond;
  });

  if (loading) {
    return <CircularProgress variant="solid" />; // Render a loading message
  }

  return (
    <div>
      {columns.map((key) =>
        !(key === "View Prescriptions" || key === "Download Prescription") ? (
          <TextField
            label={"Filter by " + key}
            name={key}
            value={filter[key] || ""}
            onChange={handleFilterChange}
          />
        ) : null
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((key) => (
                <TableCell>
                  {key.toUpperCase()}{" "}
                  <Button
                    size="small"
                    onClick={() => handleSort(key)}
                    startIcon={
                      sorting.field === key ? (
                        sorting.order === "asc" ? (
                          <ArrowUpwardIcon />
                        ) : (
                          <ArrowDownwardIcon />
                        )
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    }
                  ></Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow>
                {Object.keys(row).map((key) => (
                  <React.Fragment>
                    {key === "View Prescriptions" ? (
                      <TableCell>
                        <Button
                          className="button"
                          variant="contained"
                          onClick={handleClickOpen}
                        >
                          Details
                        </Button>
                        <Dialog open={open} onClose={handleClose}>
                          <DialogTitle>Details</DialogTitle>
                          <DialogContent>
                            {Object.keys(row).map((innerKey) =>
                              innerKey === "medicines" ? (
                                <div key={innerKey}>
                                  <DialogContentText>
                                    Medicines:
                                  </DialogContentText>
                                  {row[innerKey].map((medicine, index) => (
                                    <div key={index}>
                                      <DialogContentText>
                                        Medicine Name: {medicine.medicineName}
                                      </DialogContentText>
                                      <DialogContentText>
                                        Dose: {medicine.dose}
                                      </DialogContentText>
                                    </div>
                                  ))}
                                </div>
                              ) : null
                            )}
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="primary">
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    ) : key === "Download Prescription" ? (
                      <TableCell>
                        <Button
                          className="button"
                          //pass the doctor name and medicines to the handleDownload function
                          onClick={() =>
                            handleDownload(
                              row["doctor_name"],
                              row["medicines"],
                              row["date"],
                              row["additionalMedicines"]
                            )
                          }
                          variant="contained"
                        >
                          Download
                        </Button>
                      </TableCell>
                    ) : key === "date" ? (
                      <TableCell>
                        {new Date(row[key]).toLocaleDateString("fr-FR")}
                      </TableCell>
                    ) : testcols.includes(key.toLowerCase()) ? (
                      <TableCell>{row[key]}</TableCell>
                    ) : null}
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PrescriptionsMultiLevelFilterTable;
