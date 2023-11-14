import React, { useState, useEffect } from "react";
import ResetForm from "../../components/Home/ResetPasswordForm";

const ResetPassword = () => {
    return(
        <div>
            <ResetForm flag = {true}/>
        </div>
    );
};

export default ResetPassword;