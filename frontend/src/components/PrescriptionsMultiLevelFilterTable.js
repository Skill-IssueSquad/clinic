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
  }, [API_GET_URL, columns]);

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
                            {console.log("Prescription Data ", fullRows[i])}
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
