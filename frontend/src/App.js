import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages
import Login from "./pages/Home/Login";
import ForgotPassword from "./pages/Home/ForgotPassword";
import ResetPassword from "./pages/Home/ResetPassword";
import Doctor from "./pages/Doctor";
import DoctorProfile from "./pages/DoctorProfile";
import Admin from "./pages/Admin/Admin";
import ViewAdmins from "./pages/Admin/ViewAdmins";
import ViewDoctors from "./pages/Admin/ViewDoctors";
import ViewPatients from "./pages/Admin/ViewPatients";
import ViewRequests from "./pages/Admin/ViewRequests";
import ViewPackages from "./pages/Admin/ViewPackages";
import Patients from "./pages/Patients";
import DoctorRequest from "./pages/DoctorRequest/DoctorRequest"
import PatientRegisteration from "./pages/Home/PatientRegisteration";
import DoctorRegisteration from "./pages/Home/DoctorRegisteration";
import Patient from "./pages/Patient";
import PatientDoctors from "./pages/PatientDoctors";
import PatientAppointments from "./pages/PatientAppointments";
import { useState } from "react";


function App() {
  
  
  return (
    <div classname="app">
      <BrowserRouter>
      <AppBar hh="" gklh="" />
        <div classname="pages">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/DoctorRegisteration" element={<DoctorRegisteration/>} />
            <Route path="/PatientRegisteration" element={<PatientRegisteration/>} />
            <Route exact path="/DoctorRequest" element={<DoctorRequest />} />
            <Route exact path="/Doctor_Home" element={<Doctor />} />
            <Route exact path="/Doctor_Profile" element={<DoctorProfile />} />
            <Route exact path="/Admin" element={<Admin />} />
            <Route exact path="/Admin/ViewAdmins" element={<ViewAdmins />} />
            <Route exact path="/Admin/ViewDoctors" element={<ViewDoctors />}/>
            <Route exact path="/Admin/ViewPatients" element={<ViewPatients />} />
            <Route exact path="/Admin/ViewRequests" element={<ViewRequests />}/>
            <Route exact path="/Admin/ViewPackages" element={<ViewPackages />} />

            
            <Route exact path="/patient/" element={<Patient />} />
        <Route exact path="/patient/doctors/" element={<PatientDoctors />} />
        <Route
          exact
          path="/patient/appointments/"
          element={<PatientAppointments />}
        />
      </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
