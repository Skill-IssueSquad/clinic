import React, { useState } from "react";
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

// Sample data
const initialRows = [
  { id: 1, name: "John", age: 30, country: "USA" },
  { id: 2, name: "Alice", age: 25, country: "Canada" },
  { id: 3, name: "Bob", age: 35, country: "USA" },
  { id: 4, name: "Eve", age: 28, country: "Canada" },
];

const MultiLevelFilterTable = () => {
  const [filter, setFilter] = useState({ name: "", age: 0, country: "" });
  const [rows, setRows] = useState(initialRows);
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleSort = (field) => {
    if (field === sorting.field) {
      // Toggle sorting order
      setSorting({
        field,
        order: sorting.order === "asc" ? "desc" : "asc",
      });
      // Reverse the rows
      setRows([...rows].reverse());
    } else {
      // Set the field to sort and default order (asc)
      setSorting({
        field,
        order: "asc",
      });
      // Sort the rows by the selected field in ascending order
      setRows([...rows].sort((a, b) => a[field] - b[field]));
    }
  };

  const filteredRows = rows.filter((row) => {
    var cond1 = row.name.toLowerCase().includes(filter.name.toLowerCase());
    var cond2 = false;
    var cond3 = row.country
      .toLowerCase()
      .includes(filter.country.toLowerCase());
    if (row.age > filter.age) {
      cond2 = true;
    }
    return (
      //   row.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      //   row.age.toString().includes(filter.age) &&
      //   row.country.toLowerCase().includes(filter.country.toLowerCase())
      cond1 && cond2 && cond3
    );
  });

  return (
    <div>
      <TextField
        label="Filter by Name"
        name="name"
        value={filter.name}
        onChange={handleFilterChange}
      />
      <TextField
        label="Filter by Age"
        name="age"
        value={filter.age}
        onChange={handleFilterChange}
      />
      <TextField
        label="Filter by Country"
        name="country"
        value={filter.country}
        onChange={handleFilterChange}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                ID{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("id")}
                  startIcon={
                    sorting.field === "id" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <ArrowUpwardIcon />
                    )
                  }
                ></Button>
              </TableCell>
              <TableCell>
                Name{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("name")}
                  startIcon={
                    sorting.field === "name" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <ArrowUpwardIcon />
                    )
                  }
                ></Button>
              </TableCell>
              <TableCell>
                Age{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("age")}
                  startIcon={
                    sorting.field === "age" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <ArrowUpwardIcon />
                    )
                  }
                ></Button>
              </TableCell>
              <TableCell>
                Country{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("country")}
                  startIcon={
                    sorting.field === "country" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <ArrowUpwardIcon />
                    )
                  }
                ></Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MultiLevelFilterTable;
