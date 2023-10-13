import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, colors } from "@mui/material";
import { red } from "@mui/material/colors";
import RequestDialouge from "./RequestDialouge";


export default function DataTable() {
    const [rows, setRows] = useState([]); // State to store the rows
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const columns = [
      //{ field: '_id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Name',flex:1 ,align: 'center', headerAlign: 'center'},
      { field: 'email', headerName: 'Email', flex:1,align: 'center', headerAlign: 'center' },
      { field: 'dateOfBirth', headerName: 'Date of Birth', flex:1,align: 'center', headerAlign: 'center' },
      { field: 'username', headerName: 'Username', flex:1,align: 'center', headerAlign: 'center' },
      {
        field: 'viewInfo',
        headerName: 'View More',
        flex:1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <RequestDialouge rows={rows} username={params.row.username}/>
        ),
      },
    //   {
    //     field: 'accept',
    //     headerName: 'Accept',
    //     flex:1,
    //     align: 'center',
    //     headerAlign: 'center',
    //     renderCell: (params) => (
    //       <Button variant="contained" color="success"
    //         onClick={() => handleRemove(params.row.username)} // Define the action handler
    //       >
    //         Accept
    //       </Button>
    //     ),
    //   },
    ];


    const handleRemove = async (username) => {
      try{
        const response = await fetch('/admin/removePatient/' +username, {method: 'DELETE'});
        const json = await response.json();
      
        if(response.ok){
          // Update the state with the fetched data
          const message = json.message;
          //console.log(message);
        }
      }catch(error){
        console.error('Error fetching data:', error);
      }
    };


    // Simulate fetching data from a database
    useEffect(() => {
    // Replace this with your actual API call to fetch data from the database
    const fetchDataFromDatabase = async () => {
        try {
            // Fetch data from the database
            const response = await fetch('/admin/viewInfo');
            const json = await response.json();

            if(response.ok){
                // Update the state with the fetched data
                const data = json.data
                setRows(data);
            }
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    fetchDataFromDatabase();
    }, [setRows, handleRemove]);


    const isRowSelectable = (params) => false; // Function to make all rows unselectable
    
  return (
    <div style={{ height: 400, width: '100%' }} >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id} 
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        isRowSelectable={isRowSelectable}
        disableRowSelectionOnClick={true}
        disableColumnSelector={true}
      />
    </div>
  );
}