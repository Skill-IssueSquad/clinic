import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditPackageDialouge from "./EditPackageDialouge";
import ConfirmationAlert from "./ConfirmationAlertPackage";


  
export default function OutlinedCard({data,onClick}) {
    //const[cardData, setCardData]=useState(data);
    
    const navigate = useNavigate();

    

    const handleRemove = async ()=>{
      try{
          const response = await fetch('/admin/deletePackage/' +data.packageType, {method: 'DELETE', credentials: 'include'});
          const json = await response.json();
          console.log(json);
          if(response.ok){
            onClick(1);
            //navigate('/Admin/ViewPackages'); 
          }
      }catch(error){
          console.error('Error fetching data:', error);
      }
  };


  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" style={{margin:10}}>
      <CardContent>
            <Typography variant="h5" component="div">
              {data.packageType}  Package: {data.price_per_year} LE
            </Typography>
            <Typography sx={{ mt:1.5, mb: 1 }} color="text.secondary">
              <strong>Discounts</strong>
            </Typography>
              <Typography variant="body">
                <ul>
                  <li>
                    <strong>Doctor Session:</strong> {data.discountOnSession}%
                  </li>
                  <li>
                    <strong>Medicine Purchase:</strong> {data.discountOnMedicinePurchase}%
                  </li>
                  <li>
                    <strong>Family Member Subscription:</strong> {data.discountOnFamilySubscription}%
                  </li>
                </ul>
              </Typography>
      </CardContent>
      <CardActions>
        {/* <Button onClick={handleRemove} size="medium" color="error" style={{left:'1270px' ,top:'0px'}}>Remove</Button> */}
        <ConfirmationAlert onClick={handleRemove}/>
        <EditPackageDialouge type={data.packageType} onClick={onClick}/>
      </CardActions>
      </Card>
    </Box>
  );
}