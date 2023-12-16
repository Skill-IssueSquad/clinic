import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DoctorInfo from "../../components/DoctorRequest/Profile";
import { auth } from "../Protected/AuthProvider";
import NavBar from "../../components/navBarDoctorRequest"

const DoctorRequest = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="DoctorRequest"){
      show = true;
    }
    return(
        <div>
        {show? (
            <div>
                <NavBar button={"Profile"}/>
            <DoctorInfo flag = {true}/>
            </div>):
        (<h2>No access</h2>)
        }
        </div>
    );
};

export default DoctorRequest;