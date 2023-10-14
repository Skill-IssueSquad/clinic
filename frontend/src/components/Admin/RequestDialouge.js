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

    setText(textParagraph);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
          <Button autoFocus onClick={handleClose}>
           Done
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}