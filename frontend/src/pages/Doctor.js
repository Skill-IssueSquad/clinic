import AppBar from "../components/appBar";
import Appointments from "../components/Appointments";
import { auth } from "./Protected/AuthProvider";

const Doctor = () => {
  let show = false;

  if(auth() && localStorage.getItem('role')==="Doctor"){
      show = true;
  }


  return (
    <div>
      {show? (
      <div>
      <AppBar />
      <Appointments />
      </div>) :
      (<h2>No access</h2>)
      }
    </div>
  );
};

export default Doctor;
