import React, { useState, useEffect } from "react";
import DoctorRegisterationForm from "../../components/Home/DoctorRegisterationForm";
import AppBar from "../../components/appBar"

const DoctorRegisteration = () => {
    return(
        <div>
            <AppBar/>
            <DoctorRegisterationForm flag = {true}/>
        </div>
    );
};

export default DoctorRegisteration;