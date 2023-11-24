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



export default function FormDialog({passEmail}) {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();


  const handleClickOpen = () => {
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
        password: '',
      });
    setOpen(false);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    password: ''
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
    if (!data.password) {
        errors.password = 'Please enter the OTP';
    }
    else{
        try{
            const sendData = {password: data.password, email:passEmail};
            const response = await fetch('/account/verifyOTP', {method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendData),});

            const json = await response.json();
          
            if(response.ok){
              // Update the state with the fetched data
              setFormData({
                password: '',
                email:''
              });
              navigate('/ResetPassword',{replace:true, state: {passEmail}}); setOpen(false);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Verify Your OTP</DialogTitle>
        <DialogContent>

        <form onSubmit={handleSubmit} style={{ boxSizing:'border-box', width:400, height:160}}>
          <p>Enter the OTP you received on your email</p>
        <TextField
          type="password"
          label="OTP"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <br />
       
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        {' '}
        {' '}
        <Button type="submit" variant="contained" color="primary">
            Verify
        </Button>
      </form>
      </DialogContent>
       
      </Dialog>
    </div>
  );
}