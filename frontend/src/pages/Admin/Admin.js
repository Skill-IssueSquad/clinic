import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import Analytics from "../../components/Admin/Analytics";
import { auth } from "../Protected/AuthProvider";

const Admin = () => {
    let show = false;

    console.log(auth());
    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return(
        <div style={{backgroundColor: '#f0f0f0', padding: '5px'}}>
            {show && <AdminSideBar flag = {true} ViewComponent={<Analytics/>} item = "Dashboard"/>}
            {!show && <h2>No access</h2>}
        </div>
    );
};

export default Admin;