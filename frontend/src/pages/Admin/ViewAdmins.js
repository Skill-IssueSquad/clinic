import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import AdminTable from "../../components/Admin/AdminTable";

const ViewAdmins = () => {
    return ( 
        <AdminSideBar flag = {false} ViewComponent={<AdminTable />}/>
     );
}
 


export default ViewAdmins;