import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Patient from "./pages/Patient";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/patient/" element={<Patient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
