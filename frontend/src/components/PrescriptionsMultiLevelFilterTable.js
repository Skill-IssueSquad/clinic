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

let fullRows = [];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET_URL);
        const initialRows = response.data.data;
        fullRows = initialRows;

        const rows = initialRows.map((row) => {
          let resJson = {};
          columns.forEach((key) => {
            console.log(key);
            resJson[key] = row[key];
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
  }, []);

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
        key !== "View Prescriptions" ? (
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
                        <Popup
                          trigger={<button className="button">Details</button>}
                          modal
                        >
                          <span>
                            {Object.keys(fullRows[i]).map((innerKey) =>
                              innerKey === "medicines" ? (
                                <div>
                                  <p>Medicines:</p>
                                  {fullRows[i][innerKey].map((medicine) => (
                                    <div>
                                      <p>
                                        Medicine Name: {medicine.medicineName}
                                      </p>
                                      <p>dose: {medicine.dose}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : null
                            )}
                          </span>
                        </Popup>
                      </TableCell>
                    ) : key === "date" ? (
                      <TableCell>
                        {new Date(row[key]).toLocaleDateString("fr-FR")}
                      </TableCell>
                    ) : (
                      <TableCell>{row[key]}</TableCell>
                    )}
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
