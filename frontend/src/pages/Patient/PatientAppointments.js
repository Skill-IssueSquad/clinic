import NavBar from "../../components/navBar";
import AppointmentsMulti from "../../components/Patient/PatientAppointmentMulti";
import { auth } from "./Protected/AuthProvider";

function PatientAppointments() {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = false;
  }

  return (
    <div>
      {show ? (
        <div className="PatientDoctors">
          <NavBar name={"Patient Dashboard"} username={"bahyone"} />
          <h2>Appointments</h2>
          <AppointmentsMulti
            columns={["type", "status", "date", "doctor_name"]}
            API_GET_URL="http://localhost:8000/patient/bahyone/appointments"
          />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}

export default PatientAppointments;
