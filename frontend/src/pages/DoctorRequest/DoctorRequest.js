import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DashboardView from "../../components/Admin/DashboardView";

const Admin = () => {
    return(
        <div>
            <AdminSideBar flag = {true}/>
        </div>
    );
};

export default Admin;