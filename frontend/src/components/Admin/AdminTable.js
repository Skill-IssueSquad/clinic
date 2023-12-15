import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, colors , Breadcrumbs, Link, Typography, TableBody} from "@mui/material";
import { red } from "@mui/material/colors";
import AddAdminDialog from './AddAdminDialog';
import ConfirmationAlert from "./ConfirmationAlert";
import CircularProgress from '@mui/material/CircularProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import {Table, TableHead, TableRow} from '@mui/material'

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
        View Admins
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
      { field: 'firstName', headerName: 'First name',flex:1 ,align: 'center', headerAlign: 'center'},
      { field: 'lastName', headerName: 'Last name', flex:1,align: 'center', headerAlign: 'center' },
      { field: 'username', headerName: 'Username', flex:1,align: 'center', headerAlign: 'center' },
      {
        field: 'actions',
        headerName: '',
        flex:1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <ConfirmationAlert onClick={()=> {handleRemove(params.row.username)}}/>
        ),
      },
    ];


    const handleRemove = async (username) => {
      try{

        const response = await fetch('/admin/removeAdmin/' +username, {method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include'},);
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
            const response = await fetch('http://localhost:8000/admin/viewAdmins' , {method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'},);
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
    }, [setRows, handleRemove]);


    const isRowSelectable = (params) => false; // Function to make all rows unselectable
    
  return (
    <div>
      <a style={{fontFamily: 'Arial, sans-serif', fontSize: '20px',color: '#333', fontWeight:'bold'}}>Admins
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      </a>
      <br/>
      { !showProgress && <div style={{ height: 400, width: '100%',  backgroundColor: '#ffffff', borderRadius: '5px'}} >
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
      
      <AddAdminDialog  />
      </div>}
      {showProgress && <CircularProgress color="inherit" style={{marginLeft:'650px', marginTop:'100px'}} />} 
    </div>
  );
}