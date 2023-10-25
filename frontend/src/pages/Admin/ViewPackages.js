import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import Packages from "../../components/Admin/Packages"

const ViewPackages = () => {
    return ( 
        <AdminSideBar flag = {false} ViewComponent={<Packages />}/>
     );
}
 
export default ViewPackages;