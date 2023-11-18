import AppBar from "../../components/appBar";
import WalletBalanceComp from "../../components/Patient/WalletBalance";
import NavBar from "../../components/navBar";
import { auth } from "../Protected/AuthProvider";

function WalletBalance() {
  return (
    
    <div className="WalletBalance">
      <NavBar name={"Patient Dashboard"} username={"bahyone"} />
      <WalletBalanceComp username={"bahyone"}/>
    </div>
  );
}
export default WalletBalance;