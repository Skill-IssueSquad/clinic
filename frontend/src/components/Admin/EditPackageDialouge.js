import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { useState } from 'react';


export default function DialogSelect({type, onClick}) {
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');
  const [field,setField] = React.useState('');
  const [data, setData]  =React.useState('');
  const [errors, setErrors] = useState({});


  const handleChange = (event) => {
    setErrors({});
    setField((event.target.value) || '');
  };

  const handleValue = (e) => {
    setErrors({});
    setData((e.target.value) || '');
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
   // if (reason !== 'backdropClick') {
    setData('');
    setField('');
    setOpen(false);
    //}
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = await validateForm(data,field);
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form or perform further actions here
      handleUpdate(field,data);
      console.log('Form submitted:', data);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = async (data,field) => {
    const errors = {};
    console.log(data, field);
    if (!data) {
        errors.dataValue = 'Please enter a value';
    }
    if(!field){
        errors.fieldValue = "Please choose a field";
    }
    return errors;
}

const handleUpdate = async (field, data)=>{
    try{
        var attribute ="";
        switch(field){
            case "Price": attribute ='price_per_year'; break;
            case "Doctor Session": attribute="discountOnSession"; break;
            case "Medicine Purchase": attribute ="discountOnMedicinePurchase"; break;
            case "Family Member Subscription": attribute="discountOnFamilySubscription"; break;
        }
        const updatedData ={[attribute]: data};
        const response = await fetch('/admin/updatePackage/' +type, { method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),});

        const json = await response.json();
    
        if(response.ok){
          onClick(1);
          handleClose();
          //navigate('/Admin/ViewPackages'); 
        }
    }catch(error){
        console.error('Error fetching data:', error);
    }
};

  return (
    <div>
      <Button onClick={handleClickOpen} style={{left:'1120px' ,top:'0px'}}>Edit</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Choose the field</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Field</InputLabel>
              <Select
                native
                name="fieldValue"
                value={field}
                error={!!errors.fieldValue}
                onChange={handleChange}
                //input={<OutlinedInput label="Field" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                <option value={"Price"}>Price</option>
                <option value={"Doctor Session"}>Doctor Session</option>
                <option value={"Medicine Purchase"}>Medicine Purchase</option>
                <option value={"Family Member Subscription"}>Family Member Subscription</option>
              </Select>
            </FormControl>
            <TextField
            type='number'
            label="New Value"
            name="dataValue"
            value={data}
            error={!!errors.dataValue}
            helperText={errors.dataValue}
            onChange={handleValue}
            style={{ marginBottom: '20px', marginTop: '5px' }}
            />
            <br />
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button  type="submit"  onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}