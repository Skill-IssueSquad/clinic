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
import CircularProgress from '@mui/material/CircularProgress';



export default function FormDialog({}) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [showProgress, setShowProgress] = useState(false);


  const handleClickOpen = () => {
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
        packageType: '',
        price_per_year: '',
        discountOnSession: '',
        discountOnMedicinePurchase:'',
        discountOnFamilySubscription: '',
      });
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    packageType: '',
    price_per_year: '',
    discountOnSession: '',
    discountOnMedicinePurchase: '',
    discountOnFamilySubscription:'',
  });

  const [errors, setErrors] = useState({});

  let validationErrors = {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validationErrors = errors;
    switch(name){
      case "packageType": validationErrors.packageType = ""; break;
      case "price_per_year": validationErrors.price_per_year = ''; break;
      case "discountOnSession": validationErrors.discountOnSession = ""; break;
      case "discountOnMedicinePurchase": validationErrors.discountOnMedicinePurchase = ""; break;
      default: validationErrors.discountOnFamilySubscription = ""; break;
    }
  setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowProgress(true);
    const validationErrors = await validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form or perform further actions here
      console.log('Form submitted:', formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Submit the form when Enter key is pressed
      handleSubmit(event);
    }
  };

  const validateForm = async (data) => {
    if (!data.packageType) {
      validationErrors.packageType = 'Package type is required';
    }
    if (!data.price_per_year) {
      validationErrors.price_per_year= 'Price is required';
    }
    if (!data.discountOnSession) {
      validationErrors.discountOnSession = 'Session discount is required';
    }
    if (!data.discountOnMedicinePurchase) {
      validationErrors.discountOnMedicinePurchase = 'Medicine discount is required';
    }    
    if (!data.discountOnFamilySubscription) {
      validationErrors.discountOnFamilySubscription = 'Family subscription discount is required';
    }
    else{
        try{
            const response = await fetch('http://localhost:8000/admin/addPackage', {method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),});

            const json = await response.json();
          
            if(response.ok){
              // Update the state with the fetched data
              setFormData({
                packageType: '',
                price_per_year: '',
                discountOnSession: '',
                discountOnMedicinePurchase:'',
                discountOnFamilySubscription: '',
              });
              
              navigate('/Admin/ViewPackages'); setOpen(false);
            }
            else{
                validationErrors.username = "Package already exists";
                setShowProgress(false);
                return validationErrors;
            }
              
        }catch(error){
            console.error('Error fetching data:', error);
            setShowProgress(false);
        }
    }
    setShowProgress(false);
    return validationErrors;
  };

  return (
    <div>
      <Button variant="contained" color="success" onClick={handleClickOpen}  style={{left:'1260px' ,top:'20px'}}>
       Add Package
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Health Package</DialogTitle>
        <DialogContent>
        <div>
        <form onSubmit={handleSubmit} style={{ boxSizing:'border-box', width:400, height:480}}>
        <TextField
          label="Package Type"
          name="packageType"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.packageType}
          helperText={errors.packageType}
          fullWidth
          style={{ marginBottom: '20px', marginTop: '5px' }}
          onKeyDown={handleKeyDown}
        />
        <br />
        <TextField
          type="number"
          label="Price"
          name="price_per_year"
          value={formData.price_per_year}
          onChange={handleChange}
          error={!!errors.price_per_year}
          helperText={errors.price_per_year}
          fullWidth
          style={{ marginBottom: '20px' }}
          onKeyDown={handleKeyDown}
        />
        <br />
        <TextField
          label="Doctor Session Discount"
          name="discountOnSession"
          value={formData.discountOnSession}
          onChange={handleChange}
          error={!!errors.discountOnSession}
          helperText={errors.discountOnSession}
          fullWidth
          style={{ marginBottom: '20px'}}
          onKeyDown={handleKeyDown}
        />
        <br />
        <TextField
          label="Medicine Purchase Disount"
          name="discountOnMedicinePurchase"
          value={formData.discountOnMedicinePurchase}
          onChange={handleChange}
          error={!!errors.discountOnMedicinePurchase}
          helperText={errors.discountOnMedicinePurchase}
          fullWidth
          style={{ marginBottom: '20px' }}
          onKeyDown={handleKeyDown}
        />
        <br />
        <TextField
          label="Family Subscription Disount"
          name="discountOnFamilySubscription"
          value={formData.discountOnFamilySubscription}
          onChange={handleChange}
          error={!!errors.discountOnFamilySubscription}
          helperText={errors.discountOnFamilySubscription}
          fullWidth
          style={{ marginBottom: '20px' }}
          onKeyDown={handleKeyDown}
        />
      </form>
      </div>
        <Button autoFocus color= 'secondary' onClick={handleClose}>
           Cancel
          </Button>
        <Button type="submit" variant="contained" color="primary" style={{marginLeft:'225px'}}  onClick={handleSubmit} disabled={showProgress}>
          {!showProgress && "Register"}
          {showProgress && <CircularProgress color="inherit" size={25}/>}
        </Button>
        </DialogContent>
       
      </Dialog>
    </div>
  );
}