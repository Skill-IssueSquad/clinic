import React, { useState, useEffect } from "react";
import Login from "../../components/Home/LoginForm";
import ForgotPasswordDialouge from "../../components/Home/ForgotPasswordDialouge";
import AppBar from "../../components/appBar"

const ForgotPassword = () => {
    return(
        <div>
            <AppBar/>
            <Login flag = {true}/>
            <ForgotPasswordDialouge/>
        </div>
    );
};

export default ForgotPassword;