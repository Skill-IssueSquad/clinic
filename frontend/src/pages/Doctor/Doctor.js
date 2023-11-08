import AppBar from "../../components/appBar";
import Appointments from "../../components/Doctor/Appointments";
const Doctor = () => {
  const username = "opa%20nseet%20esmy";
  return (
    <div>
      {/* <AppBar /> */}
      <Appointments username={username} />
    </div>
  );
};

export default Doctor;
