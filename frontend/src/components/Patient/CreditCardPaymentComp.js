// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe("pk_live_51OBk7zH1dbdsVwcoUNkmTMS6p8vzPrqcCCNdfQVU4sDYCjmSL1VX4V3fIUvFvGhaU0oXz7gz1GGOSoXqIxRRkeaU00DUmqVadI"); // Replace with your actual Stripe public key

// const CreditCardPaymentForm = ({ onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);

//     const { token, error } = await stripe.createToken(cardElement);

//     if (error) {
//       console.error("Error creating token:", error);
//     } else {
//       try {
//         console.log("Server response:", response.data);
//          onSuccess();
//       } catch (error) {
//         console.error("Error processing payment:", error);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
//       <button type="submit" disabled={!stripe}>
//         Pay now
//       </button>
//     </form>
//   );
// };

// const CreditCardPaymentComp = () => {
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const handlePaymentSuccess = () => {
//     setPaymentSuccess(true);
//   };

//   return (
//     <div>
//       <h1>Credit Card Payment</h1>
//       {paymentSuccess ? (
//         <div>
//           <h2>Payment Successful</h2>
//           <p>Thank you for your payment!</p>
//         </div>
//       ) : (
//         <Elements stripe={stripePromise}>
//           <CreditCardPaymentForm onSuccess={handlePaymentSuccess} />
//         </Elements>
//       )}
//     </div>
//   );
// };

// export default CreditCardPaymentComp;
