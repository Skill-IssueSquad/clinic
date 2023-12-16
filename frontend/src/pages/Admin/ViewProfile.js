import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import Profile from "../../components/Admin/Profile";
import { auth } from "../Protected/AuthProvider";

const ViewPatients = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return (  
        <div>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<Profile />} item="View Profile"/>}
        {!show && <h2>No access</h2>}
       
        </div>
    );
}
 
export default ViewPatients;