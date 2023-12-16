import React, { useState, useEffect } from "react";
import ChangePassword from "../../components/Patient/ChangePasswordForm";
import NavBar from "../../components/navBarPatient"
import { auth } from "../Protected/AuthProvider";

const ViewPatients = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Patient"){
        show = true;
    }

    return (  
        <div>
            <NavBar button = {"Change Password"}/>
            <ChangePassword />;
        </div>
    );
}
 
export default ViewPatients;