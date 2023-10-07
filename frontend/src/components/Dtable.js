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
import SortIcon from "@mui/icons-material/Sort";

// Sample data
const initialRows = [
  { id: 1, name: "John", status: "upcoming", date: "2023-10-05" },
  { id: 2, name: "Alice", status: "completed", date: "2023-10-06" },
  { id: 3, name: "Bob", status: "cancelled", date: "2023-10-07" },
  { id: 4, name: "Eve", status: "rescheduled", date: "2023-10-08" },
];

const statusOptions = ["upcoming", "completed", "cancelled", "rescheduled"];

const MultiLevelFilterTable = () => {
  const [filter, setFilter] = useState({ name: "", status: "", date: "" });
  const [rows, setRows] = useState(initialRows);
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, status: value }));
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
      setRows(
        [...rows].sort((a, b) => {
          if (field === "date") {
            return new Date(a[field]) - new Date(b[field]);
          } else {
            return a[field] > b[field] ? 1 : -1;
          }
        })
      );
    }
  };

  const filteredRows = rows.filter((row) => {
    var cond1 = row.name.toLowerCase().includes(filter.name.toLowerCase());
    var cond2 = true;
    var cond3 = row.date.includes(filter.date);
    if (filter.status) {
      cond2 = row.status === filter.status;
    }
    return cond1 && cond2 && cond3;
  });

  return (
    <div>
      <TextField
        label="Search by Name"
        name="name"
        value={filter.name}
        onChange={handleFilterChange}
        style={{ margin: "8px", width: "180px" }}
      />
      <TextField
        label="Filter by Date"
        name="date"
        value={filter.date}
        onChange={handleFilterChange}
        style={{ margin: "8px", width: "180px" }}
      />
      <TextField
        label="Filter by Status"
        select
        name="status"
        value={filter.status}
        onChange={handleStatusChange}
        SelectProps={{
          native: true,
        }}
        style={{ margin: "8px", width: "180px" }}
      >
        <option value=""></option>
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
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
                      <SortIcon />
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
                      <SortIcon />
                    )
                  }
                ></Button>
              </TableCell>
              <TableCell>
                Status{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("status")}
                  startIcon={
                    sorting.field === "status" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <SortIcon />
                    )
                  }
                ></Button>
              </TableCell>
              <TableCell>
                Date{" "}
                <Button
                  size="small"
                  onClick={() => handleSort("date")}
                  startIcon={
                    sorting.field === "date" ? (
                      sorting.order === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )
                    ) : (
                      <SortIcon />
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
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MultiLevelFilterTable;
