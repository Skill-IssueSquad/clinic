import React, { useState, useEffect } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import DoctorInfo from "../../components/DoctorRequest/ViewInfo";

const DoctorRequest = () => {
    return(
        <div>
            <DoctorInfo flag = {true}/>
        </div>
    );
};

export default DoctorRequest;