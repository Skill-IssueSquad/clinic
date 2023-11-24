import Book from "../../components/Doctor/bookSlot";
import { auth } from "../Protected/AuthProvider";

const Follow = () => {

  let show = false;

  if (auth() && localStorage.getItem("role") === "Doctor") {
    show = true;
  }

  const username = localStorage.getItem("username");
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get("patientId");
  const appID = params.get("appID");
  return (
    show ? (
     <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h1>Follow up</h1>
      <Book username={username} patientId={patientId} appID={appID} />
    </div>) : (<h1>Access Denied</h1>)
  );
};

export default Follow;
