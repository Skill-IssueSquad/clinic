import AppBar from "../../components/appBar";
import PatientsData from "../../components/Patient/PatientsData";
import { auth } from "../Protected/AuthProvider";

const Patients = () => {
  return (
    <div>
      <AppBar />
      <PatientsData />
    </div>
  );
};

export default Patients;
