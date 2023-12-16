import NavBar from "../../components/navBarPatient";
import CreditCardPaymentComp from "../../components/Patient/CreditCardPaymentComp";
import {useEffect, useState} from "react";

function CreditCardPayment() {
return (
    <div className="CreditCardPayment">
        <NavBar username={localStorage.getItem("username")} />
        <CreditCardPaymentComp />
    </div>
  );
}

export default CreditCardPayment;