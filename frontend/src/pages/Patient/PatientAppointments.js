import MultiLevelFilterTable from "../../components/MultiLevelFilterTable";
import NavBar from "../../components/navBar";

function PatientAppointments() {
  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} />
      <h2>Appointments</h2>
      <MultiLevelFilterTable
        columns={["type", "status", "date", "doctor_id"]}
        API_GET_URL="http://localhost:8000/patient/bahyone/appointments"
      />
    </div>
  );
}

export default PatientAppointments;
