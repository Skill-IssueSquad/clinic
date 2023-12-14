import AppBar from "../../components/appBar";
import Appointments from "../../components/Doctor/Appointments";
import { auth } from "../Protected/AuthProvider";
import NavBar from "../../components/navBarForDR";

const Doctor = () => {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Doctor") {
    show = true;
  }

  const un = localStorage.getItem("username");

  return (
    <div>
      <NavBar name={"Notifications"} username={un} />
      {show ? (
        <div>
          <Appointments username={un} />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Doctor;
