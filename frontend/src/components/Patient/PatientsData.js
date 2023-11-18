import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../Loading";
import { Container } from "@mui/material";
import { auth } from "../../pages/Protected/AuthProvider";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "upcoming appointment",
    headerName: "Upcoming Appointment",
    width: 200,
  },
  // { field: "status", headerName: "Status", width: 130 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "isWithMe", headerName: "Registered with me", width: 200 },
];

export default function Appointments() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    // console.log("useEffect called");
    const f = async () => {
      const username = "opa%20nseet%20esmy";
      const test = "test";
      const res = await fetch(`/doctor/getPatients/${username}`);
      const response = await res.json();
      console.log(response);
      var i = 0;
      const newRows = [];
      response.data.map((patient, index) => {
        // const name = patient.name;
        const isWithMe = patient.isWithMe === true ? "Yes" : "No";
        const upcoming = [];
        // console.log(patient.upcoming);
        if (isWithMe === "Yes") {
          for (const appointment of patient.upcoming) {
            const add = {
              id: patient.index,
              "upcoming appointment": appointment,
              name: patient.name,
              isWithMe: isWithMe,
            };
            newRows.push(add);
          }
        } else {
          const add = {
            id: patient.index,
            "upcoming appointment": upcoming,
            name: patient.name,
            isWithMe: isWithMe,
          };
          newRows.push(add);
        }
      });
      setRows(newRows);
    };

    f();
  }, []);

  // Method to handle row selection
  const handleRowSelection = (params) => {
    const selectedRow = params.row; // The selected row data
    console.log("Selected Row:", selectedRow);
    // You can perform any action you want with the selected row data here
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {rows ? (
        // <Loading  />
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowClick={handleRowSelection} // Attach the event handler
        />
      ) : (
        <Container
          sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
        >
          <Loading />
        </Container>
      )}
    </div>
  );
}
