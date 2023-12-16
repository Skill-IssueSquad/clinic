import React, { useState, useEffect } from "react";
import ChangePassword from "../../components/Doctor/ChangePasswordForm";
import NavBar from "../../components/navBarDoctor"
import { auth } from "../Protected/AuthProvider";

const ViewPatients = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Doctor"){
        show = true;
    }

    return (  
        <div>
            <NavBar button = {"Change Password"} username={localStorage.getItem("username")}/>
            <ChangePassword />;
        </div>
    );
}
 
export default ViewPatients;