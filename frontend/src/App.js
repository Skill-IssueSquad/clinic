import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages
import Login from "./pages/Home/Login";
import ForgotPassword from "./pages/Home/ForgotPassword";
import ResetPassword from "./pages/Home/ResetPassword";
import Doctor from "./pages/Doctor/Doctor";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import Admin from "./pages/Admin/Admin";
import ViewAdmins from "./pages/Admin/ViewAdmins";
import ViewDoctors from "./pages/Admin/ViewDoctors";
import ViewPatients from "./pages/Admin/ViewPatients";
import ViewRequests from "./pages/Admin/ViewRequests";
import ViewPackages from "./pages/Admin/ViewPackages";
//import Patients from "./pages/Patient/Patients";
import DoctorRequest from "./pages/DoctorRequest/DoctorRequest";
import PatientRegisteration from "./pages/Home/PatientRegisteration";
import DoctorRegisteration from "./pages/Home/DoctorRegisteration";
import Patient from "./pages/Patient/Patient";
import PatientDoctors from "./pages/Patient/PatientDoctors";
import PatientAppointments from "./pages/Patient/PatientAppointments";
import HealthPackageShop from "./pages/Patient/HealthPackageShop";
import PatientBookSlots from "./pages/Patient/PatientBookSlots";
import Payments from "./pages/Patient/Payments";
import WalletBalance from "./pages/Patient/WalletBalance";
import MedicalHistory from "./pages/MedicalHistory";
import Follow from "./pages/Doctor/FollowUp";
import WalletPayment from "./pages/Patient/WalletPayment";
import CreditCardPayment from "./pages/Patient/CreditCardPayment";
import DoctorPrescriptions from "./pages/Doctor/Prescriptions";
import DoctorChat from "./pages/Doctor/DoctorChat";
import { useState } from "react";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <div classname="app">
      <BrowserRouter>
        <AppBar />
        <div classname="pages">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route
              path="/DoctorRegisteration"
              element={<DoctorRegisteration />}
            />
            <Route
              path="/PatientRegisteration"
              element={<PatientRegisteration />}
            />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route exact path="/DoctorRequest" element={<DoctorRequest />} />
            <Route exact path="/Doctor_Home" element={<Doctor />} />
            <Route exact path="/Doctor_Profile" element={<DoctorProfile />} />
            <Route exact path="/Doctor_FollowUp" element={<Follow />} />
            <Route exact path="/Admin" element={<Admin />} />
            <Route exact path="/Admin/ViewAdmins" element={<ViewAdmins />} />
            <Route exact path="/Admin/ViewDoctors" element={<ViewDoctors />} />
            <Route
              exact
              path="/Admin/ViewPatients"
              element={<ViewPatients />}
            />
            <Route
              exact
              path="/Admin/ViewRequests"
              element={<ViewRequests />}
            />
            <Route
              exact
              path="/Admin/ViewPackages"
              element={<ViewPackages />}
            />

            <Route exact path="/patient/" element={<Patient />} />

            <Route
              exact
              path="/patient/doctors/"
              element={<PatientDoctors />}
            />
            <Route
              exact
              path="/patient/appointments/"
              element={<PatientAppointments />}
            />
            <Route
              exact
              path="/patient/healthPackages/"
              element={<HealthPackageShop />}
            />

            <Route
              exact
              path="/patient/bookSlots/:doctor_id"
              element={<PatientBookSlots />}
            />

            <Route exact path="/patient/payments/" element={<Payments />} />

            <Route exact path="/patient/wallet/" element={<WalletBalance />} />

            <Route
              exact
              path="/patient/walletPayment/"
              element={<WalletPayment />}
            />

            <Route
              exact
              path="/patient/creditCardPayment/"
              element={<CreditCardPayment />}
            />

            <Route
              exact
              path="/patient/medicalHistory/"
              element={<MedicalHistory />}
            />
            <Route
              exact
              path="/doctor/prescriptions"
              element={<DoctorPrescriptions />}
            />
            <Route exact path="/Doctor_Chat" element={<DoctorChat />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
