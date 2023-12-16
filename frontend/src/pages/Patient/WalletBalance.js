import AppBar from "../../components/appBar";
import WalletBalanceComp from "../../components/Patient/WalletBalance";
import NavBar from "../../components/navBarPatient";
import { auth } from "../../pages/Protected/AuthProvider";

function WalletBalance() {
  let show = false;

  if (auth() && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  return (
    <div>
      {show ? (
        <div className="WalletBalance">
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
          />
          <WalletBalanceComp username={localStorage.getItem("username")} />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
}
export default WalletBalance;
