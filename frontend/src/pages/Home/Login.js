import React, { useState, useEffect } from "react";
import LoginForm from "../../components/Home/LoginForm";

const Login = () => {
    return(
        <div style={{backgroundColor: '#f0f0f0', padding: '15px'}}>
            <LoginForm flag = {true}/>
        </div>
    );
};

export default Login;