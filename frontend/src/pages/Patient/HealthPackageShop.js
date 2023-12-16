import React, { useEffect } from "react";
import HealthPackageOptions from "../../components/Patient/healthPackageOptions";
import { auth } from "../../pages/Protected/AuthProvider";
import NavBar from "../../components/navBarPatient"

const HealthPackageShop = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <NavBar button = {"Health Packages"}  username={localStorage.getItem("username")} />
      <HealthPackageOptions />;
    </div>
  );
};

export default HealthPackageShop;