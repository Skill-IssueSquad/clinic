import AppBar from "../../components/appBar";
import CreditCardPaymentComp from "../../components/Patient/CreditCardPaymentComp";
import {useEffect, useState} from "react";

function CreditCardPayment() {
return (
    <div className="CreditCardPayment">
        <AppBar />
        <CreditCardPaymentComp />
    </div>
  );
}

export default CreditCardPayment;