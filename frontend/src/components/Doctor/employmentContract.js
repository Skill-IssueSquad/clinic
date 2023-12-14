import { useState, useEffect } from "react";

const Contract = ({ setContractAccepted, contractAccepted, username }) => {
  const [markup, setMarkup] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  useEffect(() => {
    const f = async () => {
      const response = await fetch(`/doctor/contract/getMarkup/${username}`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setMarkup(data.data.markup);
        setHourlyRate(data.data.hourlyRate);
        setTotalPrice(data.data.totalPrice);
      }
    };
    f();
  }, []);

  const handleClick = async () => {
    const doctor = await fetch(`/doctor/acceptContract/${username}`, {
      credentials: "include",
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
          <p>Markup: {markup}%</p>
          <p>Hourly Rate: {hourlyRate}</p>
          <p>Total price: {totalPrice}</p>
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
