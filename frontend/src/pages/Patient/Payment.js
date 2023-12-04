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
  Button,
  Box,
} from "@mui/material";
import Stack from "@mui/joy/Stack";
import CircularProgress from "@mui/joy/CircularProgress";
import Divider from "@mui/joy/Divider";
import WalletBalanceComp from "../../components/Patient/WalletBalance";
import NavBar from "../../components/navBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderDetails from "../../components/Patient/OrderDetailsCard";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import PaySuccess from "../../components/Patient/PaySuccess";

//get patient details
const patientDetails = async (username) => {
  const res = await axios.get(`http://localhost:8000/patient/${username}`);
  return res.data.data;
};

const Payment = () => {
  const transit_id = useParams().transit_id;
  let username = localStorage.getItem("username");
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [patient, setPatient] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [success, setSuccess] = useState(null);

  const handleDialog = () => {
    setOpenDialog(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    const getPatient = async () => {
      const patientFromServer = await patientDetails(username);
      setPatient(patientFromServer);
    };

    const getTransit = async () => {
      const res = await axios.get(
        `http://localhost:8000/patient/transitPay/${transit_id}`
      );

      if (res.data.success) {
        setOrderData(res.data.data);
      }
    };

    getPatient();
    getTransit();
  }, [refresh]);

  const navigate = useNavigate();

  const handlePayment = async () => {
    let res = { data: { success: false } };
    if (orderData) {
      res = await axios.post(
        `http://localhost:8000/${orderData.postURL}`,
        orderData.payload
      );
    }

    return res.data.success;
  };

  const handleWalletPayment = async () => {
    setOpenDialog(true);
    if (patient.walletBalance >= orderData.totalPrice && !success) {
      try {
        //update wallet amount in the database
        const res = await axios.put(
          `http://localhost:8000/patient/${username}/editWalletBalance`,
          { walletBalance: patient.walletBalance - orderData.totalPrice }
        );
        setPatient(res.data.data);

        let result = await handlePayment();

        setSuccess(result);

        setPaymentSuccess(result);
      } catch (error) {
        console.error("Error updating wallet balance:", error);
      }
    } else {
      setSuccess(false);
    }

    
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={success ? "103.5vh" :"90vh"}
    >
      <Card variant="outlined">
        <WalletBalanceComp
          username={localStorage.getItem("username")}
          refresh={refresh}
        />

        {success && <PaySuccess></PaySuccess>}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="20vh"
        >
          {orderData && <OrderDetails data={orderData} />}

          <br></br>

          <Card variant="outlined">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                maxWidth: "100ch",
              }}
            >
              <Stack
                spacing={10}
                direction="row"
                sx={{
                  maxWidth: "100ch",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography level="h3">Payment Options</Typography>
                </Box>
                <Divider orientation="vertical"></Divider>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Stack spacing={2} direction="row">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleWalletPayment}
                      disabled={success}
                    >
                      Pay By Wallet
                    </Button>
                    <Divider orientation="vertical">Or</Divider>
                    <Button variant="contained" color="primary" disabled={success}>
                      Pay By Card
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Card>

          <Dialog open={openDialog} onClose={handleDialog}>
            <DialogTitle>
              {" "}
              {success == null ? "Processing" : success ? "Payment Successful" : "Payment Failed"}{" "}
            </DialogTitle>
            <DialogContent>
              {success == null ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress size="md" />
                </Box>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {success ? (
                    <Typography>
                      Your payment has been done successfully.
                    </Typography>
                  ) : (
                    <Typography>Payment failed. Not enough balance.</Typography>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialog}>OK</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Card>
    </Box>
  );
};

export default Payment;
