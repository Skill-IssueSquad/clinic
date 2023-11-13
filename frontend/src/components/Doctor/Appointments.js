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
import Loading from "../Loading";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Container } from "@mui/material";
import PDFViewer from "../pdf";
import { useNavigate } from "react-router-dom";

const statusOptions = ["upcoming", "completed", "cancelled", "rescheduled"];
const dateOperators = [">", "<", ">=", "<=", "="];

const MultiLevelFilterTable = ({ username }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ name: "", status: "", date: "" });
  const [dateOperator, setDateOperator] = useState("");
  const [dateOperand, setDateOperand] = useState("");
  const [endDateOperator, setEndDateOperator] = useState(""); // Add end date operator state
  const [endDateOperand, setEndDateOperand] = useState(""); // Add end date operand state
  const [rows, setRows] = useState(null);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/doctor/appointments/${username}`);
      const response = await res.json();
      if (res.ok) {
        const data = response.data;
        setRows(data);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    var { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusChange = (e) => {
    var { value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, status: value }));
  };

  const handleDateOperatorChange = (e) => {
    var { value } = e.target;
    setDateOperator(value);
  };

  const handleDateOperandChange = (e) => {
    var { value } = e.target;
    setDateOperand(value);
  };

  const handleEndDateOperatorChange = (e) => {
    var { value } = e.target;
    setEndDateOperator(value);
  };

  const handleEndDateOperandChange = (e) => {
    var { value } = e.target;
    setEndDateOperand(value);
  };

  const handleSort = (field) => {
    if (field === sorting.field) {
      setSorting({
        field,
        order: sorting.order === "asc" ? "desc" : "asc",
      });
      setRows([...rows].reverse());
    } else {
      setSorting({
        field,
        order: "asc",
      });
      setRows(
        [...rows].sort((a, b) => {
          if (field === "date") {
            const [aDay, aMonth, aYear] = a[field].split("/");
            const [bDay, bMonth, bYear] = b[field].split("/");
            if (aYear === bYear) {
              if (aMonth === bMonth) {
                return aDay - bDay;
              } else {
                return aMonth - bMonth;
              }
            }
            return aYear - bYear;
          } else {
            return a[field] > b[field] ? 1 : -1;
          }
        })
      );
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    handleOpenDialog();
  };

  const filteredRows = (rows || []).filter((row) => {
    var cond1 = row.name.toLowerCase().includes(filter.name.toLowerCase());
    var cond2 = true;
    var cond3 = true;
    var start = true;
    var end = true;
    if (filter.status) {
      cond2 = row.status === filter.status;
    }
    if (dateOperator && dateOperand) {
      const rowDay = row.date.split("/")[0];
      const rowMonth = row.date.split("/")[1];
      const rowYear = row.date.split("/")[2];
      const filterDay = dateOperand.split("/")[0];
      const filterMonth = dateOperand.split("/")[1];
      const filterYear = dateOperand.split("/")[2];
      switch (dateOperator) {
        case ">":
          start =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay > filterDay
                : rowMonth > filterMonth
              : rowYear > filterYear;
          break;
        case "<":
          start =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay < filterDay
                : rowMonth < filterMonth
              : rowYear < filterYear;
          break;
        case ">=":
          start =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay >= filterDay
                : rowMonth >= filterMonth
              : rowYear >= filterYear;
          break;
        case "<=":
          start =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay <= filterDay
                : rowMonth <= filterMonth
              : rowYear <= filterYear;
          break;
        case "=":
          start =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay == filterDay
                : rowMonth == filterMonth
              : rowYear == filterYear;
          break;
        default:
          start = true;
      }
    }

    if (endDateOperator && endDateOperand) {
      const rowDay = row.date.split("/")[0];
      const rowMonth = row.date.split("/")[1];
      const rowYear = row.date.split("/")[2];
      const filterDay = endDateOperand.split("/")[0];
      const filterMonth = endDateOperand.split("/")[1];
      const filterYear = endDateOperand.split("/")[2];
      switch (endDateOperator) {
        case ">":
          end =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay > filterDay
                : rowMonth > filterMonth
              : rowYear > filterYear;
          break;
        case "<":
          end =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay < filterDay
                : rowMonth < filterMonth
              : rowYear < filterYear;
          break;
        case ">=":
          end =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay >= filterDay
                : rowMonth >= filterMonth
              : rowYear >= filterYear;
          break;
        case "<=":
          end =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay <= filterDay
                : rowMonth <= filterMonth
              : rowYear <= filterYear;
          break;
        case "=":
          end =
            rowYear == filterYear
              ? rowMonth == filterMonth
                ? rowDay == filterDay
                : rowMonth == filterMonth
              : rowYear == filterYear;
          break;
        default:
          end = true;
      }
    }

    cond3 = start && end;

    return cond1 && cond2 && cond3;
  });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>My Patients</h2>
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
            label="Start Date Operator"
            select
            name="dateOperator"
            value={dateOperator}
            onChange={handleDateOperatorChange}
            SelectProps={{
              native: true,
            }}
            style={{ margin: "8px", width: "200px" }}
          >
            <option value=""></option>
            {dateOperators.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </TextField>
          <TextField
            label="Start Date Operand"
            name="dateOperand"
            value={dateOperand}
            onChange={handleDateOperandChange}
            style={{ margin: "8px", width: "200px" }}
          />
          <TextField
            label="End Date Operator"
            select
            name="endDateOperator"
            value={endDateOperator}
            onChange={handleEndDateOperatorChange}
            SelectProps={{
              native: true,
            }}
            style={{ margin: "8px", width: "200px" }}
          >
            <option value=""></option>
            {dateOperators.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </TextField>
          <TextField
            label="End Date Operand"
            name="endDateOperand"
            value={endDateOperand}
            onChange={handleEndDateOperandChange}
            style={{ margin: "8px", width: "200px" }}
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
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {selectedRow && (
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>{selectedRow.name}</DialogTitle>
              <DialogContent>
                <button
                  onClick={() =>
                    navigate(
                      `/Doctor_FollowUp/?patientId=${selectedRow._id}&appID=${selectedRow.appID}`
                    )
                  }
                >
                  Schedule a follow up
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/patient/medicalHistory/?PUN=${
                        selectedRow.PUN
                      }&IP=${false}`
                    )
                  }
                >
                  Upload medical record
                </button>

                {Object.entries(selectedRow).map(([key, value]) => {
                  if (
                    key !== "id" &&
                    key != "healthRecords" &&
                    key !== "_id" &&
                    key !== "appID" &&
                    key !== "familyMember_nationalId" &&
                    key !== "PUN"
                  ) {
                    return (
                      <div key={key}>
                        <span>{key}: </span>
                        <span>{value}</span>
                      </div>
                    );
                  } else {
                    if (key === "healthRecords" && value !== null) {
                      return (
                        <div key="healthRecords">
                          <span>healthRecords: </span>
                          {selectedRow.healthRecords.map((record, index) => {
                            return (
                              <div key={`record-${index}`}>
                                <span>Name: {record.documentName}</span>
                                <PDFViewer pdfUrl={record.documentUrl} />
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  }
                })}
              </DialogContent>
            </Dialog>
          )}
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
