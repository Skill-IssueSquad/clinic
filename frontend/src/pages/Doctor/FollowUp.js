import Book from "../../components/Doctor/bookSlot";
const Follow = () => {
  const username = "opa%20nseet%20esmy";
  const params = new URLSearchParams(window.location.search);
  const patientId = params.get("patientId");
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
      <Book username={username} />
    </div>
  );
};

export default Follow;
