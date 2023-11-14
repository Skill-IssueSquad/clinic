import React, { useState, useEffect } from "react";
import ChangeForm from "../components/ChangePasswordForm";
import { auth } from "./Protected/AuthProvider";

const ChangePassword = () => {
    let show = false;

    if(auth()){
      show = true;
    }
    return(
        <div>
            {show? (
            <div>
            <ChangeForm flag = {true}/>
            </div>):
            (<h2>No access</h2>)
            }
        </div>
    );
};

export default ChangePassword;