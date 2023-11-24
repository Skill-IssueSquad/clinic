import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DashboardView from "../../components/Admin/DashboardView";
import { auth } from "../Protected/AuthProvider";

const Admin = () => {
    let show = false;

    console.log(auth());
    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return(
        <div>
            {show && <AdminSideBar flag = {true}/>}
            {!show && <h2>No access</h2>}
        </div>
    );
};

export default Admin;