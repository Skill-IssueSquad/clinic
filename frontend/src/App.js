import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages
import Home from "./pages/Home";
import PatientRegisteration from "./pages/PatientRegisteration";
import DoctorRegisteration from "./pages/DoctorRegisteration";

function App() {
  return (
    <div classname="app">
      <BrowserRouter>
        <div classname="pages">
          <Routes>
            <Route path="/" element={<Home />} />

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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
