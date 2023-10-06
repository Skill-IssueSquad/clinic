import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "./Loading";
import { Container } from "@mui/material";
const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "name", headerName: "Name", width: 130 },
];

export default function Appointments() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    // console.log("useEffect called");
    const f = async () => {
      const username = "opa%20nseet%20esmy";
      const res = await fetch(`/doctor/appointments/${username}`);
      const response = await res.json();
      setRows(
        response.data.map((appointment, index) => {
          return {
            id: index + 1,
            date: appointment.date,
            status: appointment.status,
            name: appointment.name,
          };
        })
      );
      // console.log(response);
      // console.log(response.data);
    };

    f();
  }, []);

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
