import Home from "./pages/Home";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/Doctor_Home" element={<Doctor />} />
        <Route exact path="/Doctor_Profile" element={<DoctorProfile />} />
        <Route exact path="/Admin" element={<Admin />} />
        <Route exact path="/Admin/ViewAdmins" element={<ViewAdmins />} />
        <Route exact path="/Admin/ViewDoctors" element={<ViewDoctors />} />
        <Route exact path="/Admin/ViewPatients" element={<ViewPatients />} />
        <Route exact path="/Admin/ViewRequests" element={<ViewRequests />} />
        <Route exact path="/Admin/ViewPackages" element={<ViewPackages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
