import React, { useState, useEffect } from "react";
import PatientRegisterationForm from "../../components/Home/PatientRegisterationForm";

const PatientRegisteration = () => {
    return(
        <div style={{backgroundColor: '#f0f0f0', padding: '15px'}}>
            <PatientRegisterationForm flag = {true}/>
        </div>
    );
};

export default PatientRegisteration;