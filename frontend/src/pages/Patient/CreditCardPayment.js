import AppBar from "../../components/appBar";
import stripe from 'stripe';
import CreditCardPaymentComp from "../../components/Patient/CreditCardPaymentComp";
import {useEffect, useState} from "react";

function CreditCardPayment() {
    const [stripePromise, setStripePromise] = useState(null);
    useEffect(() => {
        fetch("http://localhost:8000/config/").then(async(res) =>{           
        const {publishableKey} = await res.json();
        console.log(publishableKey);
    });

    },[]);

  return (
    <div>
      <CreditCardPaymentComp username={"bahyone"}/>
    </div>
  );
}

export default CreditCardPayment;