import React, { useState, useEffect } from "react";
import PatientRegisterationForm from "../../components/Home/PatientRegisterationForm";
import AppBar from "../../components/appBar"

const PatientRegisteration = () => {
    return(
        <div>
            <AppBar/>
            <PatientRegisterationForm flag = {true}/>
        </div>
    );
};

export default PatientRegisteration;