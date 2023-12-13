import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import axios from "axios";
import {
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box } from "@mui/material";
import Button from "@mui/joy/Button";
import { useState } from "react";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const CheckoutForm = ({ amount, orderData, onPay, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [nameOnCard, setNameOnCard] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const handleSubmit = async () => {
    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error || nameOnCard === null) {
      console.log("Something is wrong:", error);
      if (error) {
      setErrMsg(error.message);
    } else {
        setErrMsg("Please enter name on card");
    }
      //onSuccess(false);
    } else {
      setLoading(true);
      console.log("Success!", token);
      // Then pass the token to your server to process the payment
      let res = await onPay();
      setLoading(false);
      if (res) {
        onSuccess(true);
        setDisabled(true);
      } else {
        onSuccess(false);
      }
    }

    // if (res) {
    //     onSuccess(true);
    //     setDisabled(true);
    // } else {
    //     onSuccess(false);
    // }
  };

  return (
    <Card>
      <Typography level="h3" color="primary" fontWeight="bold">
        {" "}
        Card Details{" "}
      </Typography>

      <CardElement options={{ style: { base: { fontSize: "18px" } } }} 
      onChange={(event) => setErrMsg(null)}/>

      <FormLabel> Card Holder Name</FormLabel>
      <Input
        placeholder="Enter name on card"
        value={nameOnCard}
        onChange={(event) => {
            const value = event.target.value;
            if (/^[a-zA-Z\s]*$/.test(value)) {
              setNameOnCard(value);
              setErrMsg(null);
            }
          }}
      />

      <Box display="flex" justifyContent="center">
        
        <Button
          onClick={handleSubmit}
          loading={loading}
          variant="solid"
          disabled={disabled}
        >
          Pay {amount} EGP
        </Button>
        


      </Box>
    
      {errMsg ? <p style={{ textAlign: 'center' }} >{errMsg}</p> : null}
    </Card>
    
  );
};

const StripePayCard = ({ amount, orderData, onPay, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        orderData={orderData}
        onPay={onPay}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripePayCard;
