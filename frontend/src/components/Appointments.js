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
import SortIcon from "@mui/icons-material/Sort";
import Loading from "./Loading";
import { Container, dividerClasses } from "@mui/material";

const statusOptions = ["upcoming", "completed", "cancelled", "rescheduled"];
const dateOperators = [">", "<", ">=", "<=", "="];

const MultiLevelFilterTable = () => {
  const [filter, setFilter] = useState({ name: "", status: "", date: "" });
  const [dateOperator, setDateOperator] = useState("");
  const [dateOperand, setDateOperand] = useState("");
  const [rows, setRows] = useState(null);
  const [sorting, setSorting] = useState({ field: "", order: "" });

  useEffect(() => {
    const f = async () => {
      const username = "opa%20nseet%20esmy";
      const test = "test";
      const res = await fetch(`/doctor/appointments/${username}`);
      const response = await res.json();
      if (res.ok) {
        const data = response.data;
        setRows(data);
      }
    };

    f();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, status: value }));
  };

  const handleDateOperatorChange = (e) => {
    const { value } = e.target;
    setDateOperator(value);
  };

  const handleDateOperandChange = (e) => {
    const { value } = e.target;
    setDateOperand(value);
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

  const filteredRows = (rows || []).filter((row) => {
    var cond1 = row.name.toLowerCase().includes(filter.name.toLowerCase());
    var cond2 = true;
    var cond3 = true;
    if (filter.status) {
      cond2 = row.status === filter.status;
    }
    if (dateOperator && dateOperand) {
      const rowDate = new Date(row.date);
      const filterDate = new Date(dateOperand);
      switch (dateOperator) {
        case ">":
          cond3 = rowDate > filterDate;
          break;
        case "<":
          cond3 = rowDate < filterDate;
          break;
        case ">=":
          cond3 = rowDate >= filterDate;
          break;
        case "<=":
          cond3 = rowDate <= filterDate;
          break;
        case "=":
          cond3 =
            rowDate.getDate() === filterDate.getDate() &&
            rowDate.getMonth() === filterDate.getMonth() &&
            rowDate.getFullYear() === filterDate.getFullYear();
          break;
        default:
          cond3 = true;
      }
    }
    return cond1 && cond2 && cond3;
  });

  return (
    <div>
      {rows ? (
        <div>
          <TextField
            label="Search by Name"
            name="name"
            value={filter.name}
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
          <TextField
            label="Date Operator"
            select
            name="dateOperator"
            value={dateOperator}
            onChange={handleDateOperatorChange}
            SelectProps={{
              native: true,
            }}
            style={{ margin: "8px", width: "150px" }} // Updated width here
          >
            <option value=""></option>
            {dateOperators.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </TextField>
          <TextField
            label="Date Operand"
            name="dateOperand"
            value={dateOperand}
            onChange={handleDateOperandChange}
            style={{ margin: "8px", width: "150px" }}
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
      ) : (
        <Container
          sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
        >
          <Loading />
        </Container>
      )}
    </div>
  );
};

export default MultiLevelFilterTable;
