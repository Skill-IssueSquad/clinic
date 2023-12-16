import React, { useState, useEffect } from "react";
import ResetForm from "../../components/Home/ResetPasswordForm";
import AppBar from "../../components/appBar"

const ResetPassword = () => {
    return(
        <div>
            <AppBar/>
            <ResetForm flag = {true}/>
        </div>
    );
};

export default ResetPassword;