import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import CircularProgress from "@mui/joy/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from 'react-router-dom';
import { auth } from "../../pages/Protected/AuthProvider";

let fullRows = [];

function displayDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and format to two digits.
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(
    d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
  ).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const ampm = d.getHours() < 12 ? "AM" : "PM";

  return `${year}/${month}/${day} ${hour}:${minute} ${ampm}`;
}

let testcols = []

const PatientMultiLevel = ({ columns, API_GET_URL, reqBody }) => {
  const navigate = useNavigate();
  const initFilter = {};
  columns.forEach((key) => {
    initFilter[key] = "";
  });
  const [filter, setFilter] = useState(initFilter);
  const [rows, setRows] = useState([]);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loading, setLoading] = useState(true); // Add a loading state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.post(API_GET_URL, reqBody);
        setLoading(false); // Set loading to false when data is fetched
        const initialRows = response.data.data;
        fullRows = initialRows;

        testcols = columns.map((col) => {return col.toLowerCase()})

        //const rows = initialRows

        console.log(rows);

        setRows(initialRows);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [API_GET_URL, columns, reqBody]);

  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleOpenDialog = (row) => {
    setSelectedRow(row); // Set the selectedRowIndex to the clicked row index
    setOpenDialog(true);
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

      console.log(rowValue, filterValue);

      if (filterValue === undefined) {
        // Exclude the row if the filter input is empty
        return false;
      } else {
        var regexType1 = /([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 1 sided range
        var regexType2 =
          /([<>]=?)\s*(-?\d+(\.\d+)?)\s*([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 2 sided range

        var matchType1 = query.match(regexType1);
        var matchType2 = query.match(regexType2);
        var item = parseFloat(rowValue);

        if (matchType1 && !matchType2) {
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
              : false) &&
            (operator2 === "<"
              ? item < value2
              : operator2 === "<="
              ? item <= value2
              : operator2 === ">"
              ? item > value2
              : operator2 === ">="
              ? item >= value2
              : false);
        } else if (typeof rowValue === "string") {
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

  


  const handleBookSlotsClick = (doctorId) => {
    // Use the navigate function to navigate to the specified URL
    navigate(`/patient/bookslots/${doctorId}`);
  };

  return (
    <div>
      {columns.map((key) => (
        <TextField
          label={"Filter by " + key}
          name={key}
          value={filter[key] || ""}
          onChange={handleFilterChange}
        />
      ))}
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
              <TableCell>Book Slots</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, i) => (
              <TableRow>
                {columns.map((key) => (
                  <React.Fragment>
                    {key === "name" ? (
                      <TableCell>
                        <button
                          className="button"
                          onClick={() => handleOpenDialog(row)}
                        >
                          {row[key]}
                        </button>
                      </TableCell>
                    ) : (
                      <TableCell>{row[key]}</TableCell>
                    )}
                  </React.Fragment>
                ))}
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={
                      () => handleBookSlotsClick(row["_id"])}
                    
                  >
                    View Free Slots
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {fullRows.length > 0 ? (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          {selectedRow !== null && (
            <>
              <DialogTitle>{selectedRow.name}</DialogTitle>
              <DialogContent>
                {console.log("Current Doc Data ", selectedRow)}
                {Object.keys(selectedRow).map((innerKey) =>
                  innerKey === "patientList" ? null : innerKey ===
                    "password" ? null : innerKey === "__v" ? null : innerKey ===
                    "_id" ? null : innerKey === "availableSlots" ? (
                    <div key={innerKey}>
                      <p>Available slots</p>
                      {selectedRow[innerKey].map(
                        (slot, index) => (
                          <div key={index}>
                            <p>
                              startTime: {displayDate(new Date(slot.startTime))}
                            </p>
                            <p>
                              endTime: {displayDate(new Date(slot.endTime))}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p key={innerKey}>
                      {innerKey}: {selectedRow[innerKey]}
                    </p>
                  )
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      ) : null}
    </div>
  );
};

export default PatientMultiLevel;
