import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
  } from "@mui/material";
  import WalletBalanceComp from "../../components/Patient/WalletBalance";
  import NavBar from "../../components/navBar";
  import { useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import axios from "axios";
  
  //get patient details
  const patientDetails = async (username) => {
    const res = await axios.get(`http://localhost:8000/patient/${username}`);
    return res.data.data;
  };
  
  const WalletPayment = ({username = 'bahyone'}) => {
      const [openDialog, setOpenDialog] = useState(false);
      const [paymentSuccess, setPaymentSuccess] = useState(false);
      const [patient, setPatient] = useState({});
      const paymentAmount = 1000;

      useEffect(() => {
        const getPatient = async () => {
          const patientFromServer = await patientDetails(username);
          setPatient(patientFromServer);
        };
        getPatient();
      }, []);
  
      const navigate = useNavigate();
    
      const handlePayment = async () => {
          setOpenDialog(true);

          if (patient.walletBalance >= paymentAmount) {
            setPaymentSuccess(true);
            try{
              
            //update wallet amount in the database
            const res = await axios.put(`http://localhost:8000/patient/${username}`, 
            {walletBalance: patient.walletBalance - paymentAmount});
            setPatient(res.data.data);

          } catch (error) {
            console.error("Error updating wallet balance:", error);
          }

          }
             else {
              setPaymentSuccess(false);
              }
  
      };
  
      const handleDialog = () => {
          {paymentSuccess ? navigate("/patient/") : navigate("/patient/WalletPayment/"); setOpenDialog(false)}
        }
  
      return (
          <div>
              <h3>
                  Current Wallet Balance
                  <br></br>
              </h3>
            <WalletBalanceComp username={"bahyone"}/>
  
            <div className="OrderDetails">
              <h3>
                Order Details
                <br></br>
              </h3>
              <div className="OrderDetails">
                <h4>
                  <b>Order ID:</b> 123456789
                </h4>
                <h4>
                  <b>Order Date:</b> 12/10/2021
                </h4>
                <h4>
                  <b>Order Amount:</b> {paymentAmount}
                </h4>
              </div>
  
              <br>
              </br>
  
              <Button variant="contained" color="primary" onClick={handlePayment}>
          Pay now
        </Button>
  
        <Dialog open={openDialog} onClose={handleDialog}>
          <DialogTitle> {paymentSuccess ? "Payment Successful" : "Payment Failed"} </DialogTitle>
          <DialogContent>
  
          {paymentSuccess ? (
              <Typography>Your payment has been done successfully.</Typography>
            ) : (
              <Typography>Payment failed. Not enough balance.</Typography>
            )}
  
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialog}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
      </div>
    );
  };
  
  export default WalletPayment;