import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, colors, Breadcrumbs, Link, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import RequestDialouge from "./RequestDialouge";
import CircularProgress from '@mui/material/CircularProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

export default function DataTable() {
    const [rows, setRows] = useState([]); // State to store the rows
    const [open, setOpen] = useState(false);
    const [showProgress, setShowProgress] = useState(true);
    const breadcrumbs = [
      <Link
        underline="hover"
        key="2"
        color="grey"
        href="/Admin"
        // onClick={handleClick}
      >
      {<HomeIcon style={{color: 'blue', opacity: 0.5}}></HomeIcon>}
      </Link>,
      <Typography key="3" color="grey">
        View Join Requests
      </Typography>,
    ];

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
      { field: 'status', headerName: 'Status',flex:1 ,align: 'center', headerAlign: 'center'},
    ];



    // Simulate fetching data from a database
    useEffect(() => {
    // Replace this with your actual API call to fetch data from the database
    const fetchDataFromDatabase = async () => {
        try {
            // Fetch data from the database
            const response = await fetch('/admin/viewInfo', {credentials: 'include',});
            const json = await response.json();

            if(response.ok){
                // Update the state with the fetched data
                const data = json.data
                setRows(data);
                setShowProgress(false);
            }
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    fetchDataFromDatabase();
    }, []);


    const isRowSelectable = (params) => false; // Function to make all rows unselectable
    
  return (
    <div>
      <a style={{fontFamily: 'Arial, sans-serif', fontSize: '20px',color: '#333', fontWeight:'bold'}}>Join Requests
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      </a>
      <br/>
    {!showProgress && <div style={{ height: 400, width: '100%',  backgroundColor: '#ffffff', borderRadius: '5px'}} >
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
    </div>}
    {showProgress && <CircularProgress color="inherit" style={{marginLeft:'650px', marginTop:'100px'}} />} 
    </div>
  );
}