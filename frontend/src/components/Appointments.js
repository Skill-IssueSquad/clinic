import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "date", headerName: "Date", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  {
    field: "fullName",
    headerName: "Full name",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    status: "Pending",
    date: "2022-01-01",
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    status: "Approved",
    date: "2022-01-02",
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    status: "Pending",
    date: "2022-01-03",
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    status: "Approved",
    date: "2022-01-04",
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    status: "Pending",
    date: "2022-01-05",
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    status: "Approved",
    date: "2022-01-06",
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    status: "Pending",
    date: "2022-01-07",
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    status: "Approved",
    date: "2022-01-08",
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    status: "Pending",
    date: "2022-01-09",
  },
];

export default function Appointments() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
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
    </div>
  );
}
