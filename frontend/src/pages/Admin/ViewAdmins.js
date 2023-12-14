import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import AdminTable from "../../components/Admin/AdminTable";
import { auth } from "../Protected/AuthProvider";

const ViewAdmins = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return ( 
        <div style={{backgroundColor: '#f0f0f0', paddingBottom: '220px'}}>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<AdminTable />} item = "Admin"/>}
        {!show && <h2>No access</h2>}
        </div>
     );
}
 


export default ViewAdmins;