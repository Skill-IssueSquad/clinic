import NavBar from "../../components/navBar";
import AppointmentsMulti from "../../components/Patient/PatientAppointmentMulti";

function PatientAppointments() {
  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} />
      <h2>Appointments</h2>
      <AppointmentsMulti
        columns={["type", "status", "date", "doctor_name"]}
        API_GET_URL="http://localhost:8000/patient/bahyone/appointments"
      />
    </div>
  );
}

export default PatientAppointments;
