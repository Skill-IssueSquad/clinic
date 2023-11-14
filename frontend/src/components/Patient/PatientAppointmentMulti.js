import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
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
import { Select, MenuItem } from "@mui/material";

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

function isMongoDbIsoDate(str) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{2}:\d{2})$/;
  return regex.test(str);
}

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

let docNames = new Set();

const AppointmentsMulti = ({ columns, API_GET_URL }) => {
  const initFilter = {};
  columns.forEach((key) => {
    initFilter[key] = "";
  });
  const [filter, setFilter] = useState(initFilter);
  const [rows, setRows] = useState([]);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET_URL);
        const initialRows = response.data.data;

        const rows = initialRows.map((row) => {
          let resJson = {};
          columns.forEach((key) => {
            console.log(key);
            resJson[key] = row[key];
            if (key == "doctor_name") {
              docNames.add(row[key]);
            }
            resJson["familyMember_nationalId"] = row["familyMember_nationalId"];
          });

          return resJson;
        });

        console.log(rows);

        setRows(rows);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [API_GET_URL, columns]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleDropdownChange = (e) => {
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

      console.log(rowValue, filterValue);

      if (filterValue === undefined) {
        // Exclude the row if the filter input is empty
        return false;
      } else {
        var regexType1 = /([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 1 sided range
        var regexType2 =
          /([<>]=?)\s*(-?\d+(\.\d+)?)\s*([<>]=?)\s*(-?\d+(\.\d+)?)/; // number 2 sided range
        var regexDate1 =
          /([><]=?)\s*((\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])|\d{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01]))\s+(?:0[1-9]|1[0-2]|\d):(?:[0-5][0-9])\s+(?:AM|PM|am|pm))/;
        var regexDate2 =
          /([><]=?)\s*((\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])|\d{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01]))\s+(?:0[1-9]|1[0-2]|\d):(?:[0-5][0-9])\s+(?:AM|PM|am|pm))\s*([><]=?)\s*((\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])|\d{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01]))\s+(?:0[1-9]|1[0-2]|\d):(?:[0-5][0-9])\s+(?:AM|PM|am|pm))/;

        var matchType1 = query.match(regexType1);
        var matchType2 = query.match(regexType2);
        var matchDate1 = query.match(regexDate1);
        var matchDate2 = query.match(regexDate2);

        var item = parseFloat(rowValue);
        if (matchDate1 && !matchDate2) {
          var operator = matchDate1[1];
          var value = matchDate1[2];

          var date = new Date(convertDateFormat(value));
          var itemDate = new Date(rowValue);

          console.log(date);

          // Adjust for AM/PM format
          if (value.includes("PM")) {
            date.setHours(date.getHours() + 12);
          }

          console.log("xfy");

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
          var operator1 = matchDate2[1];
          var value1 = matchDate2[2];
          var operator2 = matchDate2[8];
          var value2 = matchDate2[9];
          console.log(operator1, "|", value1, "|", operator2, "|", value2);

          var date1 = new Date(convertDateFormat(value1));
          var date2 = new Date(convertDateFormat(value2));

          console.log(
            convertDateFormat(value1),
            "|",
            convertDateFormat(value2)
          );
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
          console.log("bruh");
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
          //   if (/(<|>|<=|>=)/.test(filterValue)) {
          //     return false;
          //   }
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
      <div style={{ display: "flex", alignItems: "center" }}>
        {columns.map((key) =>
          key !== "doctor_name" ? (
            <TextField
              key={key}
              label={"Filter by " + key}
              name={key}
              value={filter[key] || ""}
              onChange={handleFilterChange}
              style={{ marginRight: "10px" }} // Add margin to separate elements
            />
          ) : (
            <div key={key}>
              <TextField
                select
                label="Select a doctor"
                name="doctor_name"
                value={filter["doctor_name"] || ""}
                onChange={handleDropdownChange}
                style={{ width: "200px" }} // Set a fixed width for the select
              >
                <MenuItem value="">Select a doctor</MenuItem>
                {[...docNames].map((doctorName) => (
                  <MenuItem key={doctorName} value={doctorName}>
                    {doctorName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )
        )}
      </div>

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
              <TableCell>RELATION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow>
                {Object.keys(row).map((key) =>
                  isMongoDbIsoDate(row[key]) ? (
                    <TableCell>{displayDate(row[key])}</TableCell>
                  ) : key !== "familyMember_nationalId" ? (
                    <TableCell>{row[key]}</TableCell>
                  ) : null
                )}
                {row["familyMember_nationalId"] ? (
                  <TableCell>Family Member</TableCell>
                ) : (
                  <TableCell>Self</TableCell>
                )}
                {<TableCell></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AppointmentsMulti;
