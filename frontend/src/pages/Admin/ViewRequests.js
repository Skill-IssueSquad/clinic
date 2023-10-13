import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import RequestTable from "../../components/Admin/RequestTable";

const ViewRequests = () => {
    return (
        <AdminSideBar flag = {false} ViewComponent={<RequestTable/>}/>
     );
}
 
export default ViewRequests;