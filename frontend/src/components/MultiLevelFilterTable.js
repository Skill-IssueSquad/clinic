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

const MultiLevelFilterTable = ({ columns, API_GET_URL }) => {
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

      console.log(rowValue, filterValue);

      if (filterValue === undefined) {
        // Exclude the row if the filter input is empty
        return false;
      } else {
        if (typeof rowValue === "string") {
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow>
                {Object.keys(row).map((key) => (
                  <TableCell>{row[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MultiLevelFilterTable;