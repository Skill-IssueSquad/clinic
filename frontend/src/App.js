import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Patient from "./pages/Patient";
import PatientDoctors from "./pages/PatientDoctors";
import PatientAppointments from "./pages/PatientAppointments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/patient/" element={<Patient />} />
        <Route exact path="/patient/doctors/" element={<PatientDoctors />} />
        <Route
          exact
          path="/patient/appointments/"
          element={<PatientAppointments />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
