import NavBar from "../../components/navBarPatient";
import PatientsData from "../../components/Patient/PatientsData";
import { auth } from "../../pages/Protected/AuthProvider";

const Patients = () => {
  return (
    <div>
      <NavBar username={localStorage.getItem("username")}/>
      <PatientsData />
    </div>
  );
};

export default Patients;
