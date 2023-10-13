import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import PatientTable from "../../components/Admin/PatientTable";

const ViewPatients = () => {
    return (  
        <AdminSideBar flag = {false} ViewComponent={<PatientTable />}/>
    );
}
 
export default ViewPatients;