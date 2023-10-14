import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DoctorTable from "../../components/Admin/DoctorTable";

const ViewDoctors = () => {
    return ( 
        <AdminSideBar flag = {false} ViewComponent={<DoctorTable />}/>
     );
}
 
export default ViewDoctors;