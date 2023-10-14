import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import RequestTable from "../../components/Admin/RequestTable";


const ViewRequests = () => {
    return (
        <div>
            <AdminSideBar flag = {false} ViewComponent={<RequestTable/>}/>
        </div>
     );
}
 
export default ViewRequests;