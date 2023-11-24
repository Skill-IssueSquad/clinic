import React, { useState, useEffect } from "react";
import DoctorRegisterationForm from "../../components/Home/DoctorRegisterationForm";

const DoctorRegisteration = () => {
    return(
        <div>
            <DoctorRegisterationForm flag = {true}/>
        </div>
    );
};

export default DoctorRegisteration;