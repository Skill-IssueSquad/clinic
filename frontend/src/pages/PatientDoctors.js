import PatientMultiLevel from "../components/PatientDoctorsMultiLevelGrid";
import NavBar from "../components/navBar";

function PatientDoctors() {
  return (
    <div className="PatientDoctors">
      <NavBar name={"Patient Dashboard"} />
      <h2>Doctors</h2>
      <PatientMultiLevel
        columns={["name", "email", "sessionPrice", "educationalBackground"]}
        API_GET_URL="http://localhost:8000/patient/bahyone/doctors"
      />
    </div>
  );
}

export default PatientDoctors;
