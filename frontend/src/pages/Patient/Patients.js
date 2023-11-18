import AppBar from "../../components/appBar";
import PatientsData from "../../components/Patient/PatientsData";
import { auth } from "../../pages/Protected/AuthProvider";

const Patients = () => {
  return (
    <div>
      <AppBar />
      <PatientsData />
    </div>
  );
};

export default Patients;
