import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AppBar from "./components/appBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Doctor from "./pages/Doctor";
import DoctorProfile from "./pages/DoctorProfile";
import Patients from "./pages/Patients";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/Doctor_Home" element={<Doctor />} />
        <Route exact path="/Doctor_Profile" element={<DoctorProfile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
