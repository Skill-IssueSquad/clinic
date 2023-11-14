import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = () => {
  // State to hold the authentication token
  
}

export const auth = () =>{
  const token = (localStorage.getItem('token')) ;

  if(token){
    return true;
  }
  return false;
}

export default AuthProvider;