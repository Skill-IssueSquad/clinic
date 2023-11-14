import Home from "./pages/Home";
import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages
import Doctor from "./pages/Doctor/Doctor";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import Admin from "./pages/Admin/Admin";
import ViewAdmins from "./pages/Admin/ViewAdmins";
import ViewDoctors from "./pages/Admin/ViewDoctors";
import ViewPatients from "./pages/Admin/ViewPatients";
import ViewRequests from "./pages/Admin/ViewRequests";
import ViewPackages from "./pages/Admin/ViewPackages";
//import Patients from "./pages/Patient/Patients";
import PatientRegisteration from "./pages/Patient/PatientRegisteration";
import DoctorRegisteration from "./pages/DoctorRegisteration";
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

function App() {
  return (
    <div classname="app">
      <BrowserRouter>
        <AppBar />
        <div classname="pages">
          <Routes>
            <Route path="/" element={<Home />} />
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

            <Route
              exact
              path="/patientRegisteration"
              element={<PatientRegisteration />}
            />

            <Route
              exact
              path="/doctorRegisteration"
              element={<DoctorRegisteration />}
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

            <Route 
            exact path="/patient/payments/" 
            element={<Payments />} 
            />

            <Route 
            exact path="/patient/wallet/" 
            element={<WalletBalance />} 
            />

            <Route 
            exact path="/patient/walletPayment/" 
            element={<WalletPayment />} 
            />

            <Route 
            exact path="/patient/creditCardPayment/" 
            element={<CreditCardPayment />} 
            />

                <Route
              exact
              path="/patient/medicalHistory/"
              element={<MedicalHistory />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
