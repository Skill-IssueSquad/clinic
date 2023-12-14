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
import validator from 'validator';


export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();


  const handleClickOpen = () => {
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
      });
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
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
    if (!data.username) {
        errors.username = 'Username is required';
    }
    if (!data.password) {
    errors.password = 'Password is required';
    }
    else if (!validator.isStrongPassword(data.password, { 
      minLength: 8, minLowercase: 1, 
      minUppercase: 1, minNumbers: 1, minSymbols: 1 
      })) {
      errors.password = 'Password does not match required format';
    }
    if(!data.email) {
      errors.email = 'Email is required';
    }
    else if(!validator.isEmail(data.email)){
      errors.email = "Email is invalid";
    }
    else{
        try{
            const response = await fetch('http://localhost:8000/admin/createAdmin/', {method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),});

            const json = await response.json();
          
            if(response.ok){
              // Update the state with the fetched data
              setFormData({
                username: '',
                password: '',
                email: '',
                firstName: '',
                lastName: '',
              });
              navigate('/Admin/ViewAdmins'); setOpen(false);
            }
            else{
                //errors.username = "Username already taken";
                const err = json.message;
                if(err === "Username is already taken"){
                  errors.username = err;
                }
                else if (err === "Email is already taken"){
                  errors.email = err;
                }
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
      <Button variant="contained" color="success" onClick={handleClickOpen}  style={{left:'1280px' ,top:'20px'}}>
       Add Admin
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new Admin</DialogTitle>
        <DialogContent>

        <form onSubmit={handleSubmit} style={{ boxSizing:'border-box', width:400, height:450}}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          style={{ marginBottom: '20px', marginTop: '5px' }}
        />
        <br />
        <TextField
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <br />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <br />
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
          style={{ marginBottom: '20px'}}
        />
        <br />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <br />
       
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
        </DialogContent>
       
      </Dialog>
    </div>
  );
}