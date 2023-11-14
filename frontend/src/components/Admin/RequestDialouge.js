import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import PDFViewer from './pdf';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({rows, username}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const path = "AdminStaticData/Test.pdf";
  const [user, setUser] = React.useState('');


  const handleClickOpen = () => {
    const info = rows.find((item) => item.username === username);
    const textParagraph = [
        "Name: " + info.name +"\n",
        "Email: " + info.email,
        "Date of Birth" + info.dateOfBirth,
        "Username: " + info.username,
        "Hourly Rate: " + info.hourlyRate,
        "Affiliate Hospital: " +info.affiliatedHospital,
        "Educational Background: " + info.educationalBackground,
    ]
    setUser(info.username);
    setText(textParagraph);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleReject = async () => {
    try {
      const response = await fetch('/admin/rejectDoctor' , {method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),});

        console.log("gets response");
      const json = await response.json();
      console.log("parses response");


      if(response.ok){
          // Update the state with the fetched data
          window.location.reload();
          setOpen(false);     
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await fetch('/admin/acceptDoctor' , {method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),});

      const json = await response.json();

      if(response.ok){
          // Update the state with the fetched data
          setOpen(false);     
          window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        View
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Join Request Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        {text && text.map((data, index) => (
            <p>{data}
            </p>
          ))
        }
        {console.log("hi")}
        <PDFViewer pdfUrl="http://localhost:8000/AdminStaticData/Test.pdf"/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color= 'secondary' onClick={handleClose}>
           Cancel
          </Button>
          <Button autoFocus color='warning' onClick={handleReject}>
           Reject
          </Button>
          <Button autoFocus onClick={handleAccept}>
           Accept
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}