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
        <div>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<AdminTable />}/>}
        {!show && <h2>No access</h2>}
        </div>
     );
}
 


export default ViewAdmins;