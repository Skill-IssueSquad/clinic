import React, { useState, useEffect } from "react";
import Login from "../../components/Home/LoginForm";
import ForgotPasswordDialouge from "../../components/Home/ForgotPasswordDialouge";

const ForgotPassword = () => {
    return(
        <div>
            <Login flag = {true}/>
            <ForgotPasswordDialouge/>
        </div>
    );
};

export default ForgotPassword;