import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import Packages from "../../components/Admin/Packages"
import { auth } from "../Protected/AuthProvider";


const ViewPackages = () => {
    let show = false;

    if(auth() && localStorage.getItem('role')==="Admin"){
        show = true;
    }

    return ( 
        <div>
        {show &&  <AdminSideBar flag = {false} ViewComponent={<Packages />}/>}
        {!show && <h2>No access</h2>}
       
        </div>
     );
}
 
export default ViewPackages;