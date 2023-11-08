import Book from "../../components/Doctor/bookSlot";
const Follow = () => {
  const username = "opa%20nseet%20esmy";
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get("patientId");
  const appID = params.get("appID");
  return (
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
    </div>
  );
};

export default Follow;
