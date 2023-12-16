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
import { useNavigate } from "react-router-dom";
import { auth } from "../../pages/Protected/AuthProvider";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/material";
//import Box from '@mui/joy/Box';
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";
import ContactSplitButton from "./PatientContactSplitButton";

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

let testcols = [];

const PatientMultiLevel = ({ columns, API_GET_URL, reqBody, loadng }) => {
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
  const [canBook, setCanBook] = useState(false);
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        loadng(true);
        const response = await axios.post(API_GET_URL, reqBody, {withCredentials: true});
        setLoading(false); // Set loading to false when data is fetched
        loadng(false);
        const initialRows = response.data.data.doctors;
        setPatientId(response.data.data.patientId);
        setCanBook(response.data.data.amountDue === 0);
        fullRows = initialRows;

        testcols = columns.map((col) => {
          return col.toLowerCase();
        });

        //const rows = initialRows

        console.log(rows);

        setRows(initialRows);
        setLoading(false); // Set loading to false when data is available
        loadng(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
        loadng(false);
      }
    };

    fetchData();
  }, [API_GET_URL, reqBody]);

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
    >
      <Card
        sx={{
          maxWidth: "120ch",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {columns.map((key) => (
            <TextField
              label={"Filter by " + key}
              name={key}
              value={filter[key] || ""}
              onChange={handleFilterChange}
              style={{ marginRight: "10px" }}
            />
          ))}
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
                <TableCell>Book Slots</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row, i) => (
                <TableRow>
                  {columns.map((key) => (
                    <React.Fragment>
                      {key === "name" ? (
                        <TableCell>
                          <Link
                            href="#common-examples"
                            underline="none"
                            variant="outlined"
                            color="neutral"
                            onClick={() => handleOpenDialog(row)}
                            endDecorator={
                              <Chip
                                color="primary"
                                variant="solid"
                                size="sm"
                                sx={{}}
                              >
                                i
                              </Chip>
                            }
                            sx={{
                              "--Link-gap": "0.5rem",
                              pl: 1,
                              py: 0.5,
                              borderRadius: "md",
                            }}
                          >
                            {row[key]}
                          </Link>
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
                      onClick={() => handleBookSlotsClick(row["_id"])}
                    >
                      View Free Slots
                    </Button>
                  </TableCell>

                  <TableCell>
                    <ContactSplitButton canContact={row["isPatientToDoc"]} doctorId={row["_id"]} patientId={patientId} doctorUsername={row["username"]}></ContactSplitButton>
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
                  {Object.keys(selectedRow).map((innerKey) => {
                    return [
                      "name",
                      "email",
                      "dateOfBirth",
                      "affiliatedHospital",
                      "educationalBackground",
                      "sessionPrice",
                    ].includes(innerKey) ? (
                      <Stack direction={"row"} spacing={"5px"}>
                        <Typography level="title-md">{innerKey}: </Typography>
                        <Typography level="body-md">
                          {selectedRow[innerKey]}
                        </Typography>
                      </Stack>
                    ) : null;
                  })}
                </DialogContent>
              </>
            )}
          </Dialog>
        ) : null}
      </Card>
    </Box>
  );
};

export default PatientMultiLevel;
