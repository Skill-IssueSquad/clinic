import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import WalletBalanceComp from "../../components/Patient/WalletBalance";



const Payments = () => {
  const navigate = useNavigate();
  
  const goToWalletPayment = () => {
    navigate("/patient/WalletPayment/");
  }

  const goToCreditCardPayment = () => {
    navigate("/patient/CreditCardPayment/");
  }

  return (
    <div>

      <h1>Payments</h1>

      <Button variant="contained" color="primary" onClick = {goToWalletPayment}>
        Pay With Wallet Balance
      </Button>
      <br></br>
      <br></br>
      <br></br>
      <Button variant="contained" color="primary" onClick = {goToCreditCardPayment}>
        Pay With Credit Card
      </Button>

    </div>
  );
};
export default Payments;
