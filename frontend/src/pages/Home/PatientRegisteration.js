import React, { useState, useEffect } from "react";
import PatientRegisterationForm from "../../components/Home/PatientRegisterationForm";

const PatientRegisteration = () => {
    return(
        <div>
            <PatientRegisterationForm flag = {true}/>
        </div>
    );
};

export default PatientRegisteration;