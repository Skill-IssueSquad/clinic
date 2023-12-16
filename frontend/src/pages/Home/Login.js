import React, { useState, useEffect } from "react";
import LoginForm from "../../components/Home/LoginForm";
import AppBar from "../../components/appBar"

const Login = () => {
    return(
        <div>
            <AppBar />
            <LoginForm flag = {true}/>
        </div>
    );
};

export default Login;