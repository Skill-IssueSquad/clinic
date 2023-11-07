const Contract = ({
  hourlyRate,
  setContractAccepted,
  contractAccepted,
  username,
}) => {
  const handleClick = async () => {
    const doctor = await fetch(`/doctor/acceptContract/${username}`, {
      method: "POST",
    });
    const data = await doctor.json();
    if (data.success) {
      setContractAccepted(true);
    }
  };

  return (
    <div>
      <h1>Contract</h1>
      <p>Markup: 10%</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <p>Total price: {hourlyRate + hourlyRate * 0.1}</p>
      {!contractAccepted && <button onClick={handleClick}>Accept</button>}
      {contractAccepted && <p style={{ color: "green" }}>Contract Accepted</p>}
    </div>
  );
};

export default Contract;
