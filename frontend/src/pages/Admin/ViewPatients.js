import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import PatientTable from "../../components/Admin/PatientTable";
import { auth } from "../Protected/AuthProvider";

const ViewPatients = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return (  
        <div>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<PatientTable />} item="Patient"/>}
        {!show && <h2>No access</h2>}
       
        </div>
    );
}
 
export default ViewPatients;