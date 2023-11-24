import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slide } from '@mui/material';
import VerifyOTP from "./VerifyOTPDialouge";



export default function FormDialog() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [openVerify, setOpenVerify] = useState(false);
  const [email, setEmail] = useState('');

  const handleClickOpen = () => {
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
        email: ''
      });
    setOpen(false);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form or perform further actions here
      console.log('Form submitted:', formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = async (data) => {
    const errors = {};
    if (!data.email) {
        errors.email = 'Email is required';
    }
    else{
        try{
            const response = await fetch('/account/forgotPassword', {method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),});

            const json = await response.json();
          
            if(response.ok){
              // Update the state with the fetched data
              setEmail(data.email);
              setFormData({
                email: ''
              });
              setOpen(false);
              setOpenVerify(true);
            }
            else{
                errors.email = json.message;
                return errors;
            }
              
        }catch(error){
            console.error('Error fetching data:', error);
        }
    }
    return errors;
  };

  return (
    <div>
      <Button variant="underlined" color="success" onClick={handleClickOpen}  style={{left:'1280px' ,top:'20px'}}>
       Forgot Password?
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Your Password?</DialogTitle>
        <DialogContent>

        <form onSubmit={handleSubmit} style={{ boxSizing:'border-box', width:400, height:200}}>
          <p>Send a OTP(one time password) to your email to reset the password</p>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          style={{ marginBottom: '20px', marginTop: '5px' }}
        />
        <br />
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        {' '}
        {' '}
        <Button type="submit" variant="contained" color="primary">
          Send OTP
        </Button>
      </form>
      </DialogContent>
       
      </Dialog>
      {openVerify && <VerifyOTP passEmail={email}></VerifyOTP>}
    </div>
  );
}