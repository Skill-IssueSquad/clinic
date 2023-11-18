import NavBar from "../../components/navBar";
import SlotBooker from "../../components/Patient/PatientSlotBooker";
import { useParams } from "react-router-dom";
import { auth } from "../Protected/AuthProvider";

function PatientBookSlots() {
  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} username={"bahyone"} />
      
      <SlotBooker doctor_id={useParams().doctor_id}/>
    </div>
  );
}

export default PatientBookSlots;