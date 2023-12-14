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
  const type = params.get("type");
  const isFollowUp = params.get("A") === "F";
  return show ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      {isFollowUp ? <h1>Follow up</h1> : <h1>Reschedule</h1>}{" "}
      <Book
        username={username}
        patientId={patientId}
        appID={appID}
        type={type}
        isFollowUp={isFollowUp}
      />
    </div>
  ) : (
    <h1>Access Denied</h1>
  );
};

export default Follow;
