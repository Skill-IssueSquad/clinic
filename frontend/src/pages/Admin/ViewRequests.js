import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import RequestTable from "../../components/Admin/RequestTable";
import { auth } from "../Protected/AuthProvider";



const ViewRequests = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return (
        <div style={{backgroundColor: '#f0f0f0', paddingBottom: '220px'}}>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<RequestTable/>} item="Join Requests"/>}
        {!show && <h2>No access</h2>}
       
        </div>
     );
}
 
export default ViewRequests;