import Home from "./pages/Home";
import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages
import Doctor from "./pages/Doctor";
import DoctorProfile from "./pages/DoctorProfile";
import Admin from "./pages/Admin/Admin";
import ViewAdmins from "./pages/Admin/ViewAdmins";
import ViewDoctors from "./pages/Admin/ViewDoctors";
import ViewPatients from "./pages/Admin/ViewPatients";
import ViewRequests from "./pages/Admin/ViewRequests";
import ViewPackages from "./pages/Admin/ViewPackages";
import Patients from "./pages/Patients";
import PatientRegisteration from "./pages/PatientRegisteration";
import DoctorRegisteration from "./pages/DoctorRegisteration";
import Patient from "./pages/Patient";
import PatientDoctors from "./pages/PatientDoctors";
import PatientAppointments from "./pages/PatientAppointments";

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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
