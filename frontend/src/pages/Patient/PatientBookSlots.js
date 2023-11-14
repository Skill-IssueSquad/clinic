import NavBar from "../../components/navBar";
import SlotBooker from "../../components/Patient/PatientSlotBooker";
import { useParams } from "react-router-dom";

function PatientBookSlots() {
  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} username={"bahyone"} />
      
      <SlotBooker doctor_id={useParams().doctor_id}/>
    </div>
  );
}

export default PatientBookSlots;