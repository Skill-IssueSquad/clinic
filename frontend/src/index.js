import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctor from "./pages/Doctor";
import DoctorProfile from "./pages/DoctorProfile";
import Admin from "./pages/Admin/Admin";
import ViewAdmins from "./pages/Admin/ViewAdmins";
import ViewDoctors from "./pages/Admin/ViewDoctors";
import ViewPatients from "./pages/Admin/ViewPatients";
import ViewRequests from "./pages/Admin/ViewRequests";
import ViewPackages from "./pages/Admin/ViewPackages";
import Patients from "./pages/Patients";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/Doctor_Home" element={<Doctor />} />
        <Route exact path="/Doctor_Profile" element={<DoctorProfile />} />
        <Route 
            exact path="/Admin" 
            element={<Admin />} 
        />
        <Route
            exact path="/Admin/ViewAdmins" 
            element={<ViewAdmins />} 
        />
        <Route
            exact path="/Admin/ViewDoctors" 
            element={<ViewDoctors />} 
        />
        <Route
            exact path="/Admin/ViewPatients" 
            element={<ViewPatients />} 
        />
        <Route
            exact path="/Admin/ViewRequests" 
            element={<ViewRequests />} 
        />
        <Route
            exact path="/Admin/ViewPackages" 
            element={<ViewPackages />} 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

