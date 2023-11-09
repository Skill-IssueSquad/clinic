import { useState, useEffect } from "react";

const Contract = ({
  hourlyRate,
  setContractAccepted,
  contractAccepted,
  username,
}) => {
  const [markup, setMarkup] = useState(null);
  useEffect(() => {
    const f = async () => {
      const response = await fetch("/doctor/contract/getMarkup");
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setMarkup(data.data);
      }
    };
    f();
  }, []);

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
      {markup ? (
        <>
          <p>Markup: 10%</p>
          <p>Hourly Rate: {hourlyRate}</p>
          <p>Total price: {(hourlyRate + hourlyRate * 0.1).toFixed(2)}</p>
          {!contractAccepted && <button onClick={handleClick}>Accept</button>}
          {contractAccepted && (
            <p style={{ color: "green" }}>Contract Accepted</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Contract;
