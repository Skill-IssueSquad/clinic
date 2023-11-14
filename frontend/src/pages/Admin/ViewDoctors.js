import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DoctorTable from "../../components/Admin/DoctorTable";
import { auth } from "../Protected/AuthProvider";

const ViewDoctors = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return ( 
        <div>
        {show && <AdminSideBar flag = {false} ViewComponent={<DoctorTable />}/>}
        {!show && <h2>No access</h2>}
        
        </div>
     );
}
 
export default ViewDoctors;