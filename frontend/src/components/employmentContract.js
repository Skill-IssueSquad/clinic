const Contract = ({ hourlyRate, setContractAccepted }) => {
  const markup = 0.2;
  const handleClick = () => {
    setContractAccepted(true);
  };

  return (
    <div>
      <h1>Contract</h1>
      <p>Markup: 10%</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <p>Total price: {hourlyRate + hourlyRate * 0.1}</p>
      <button onClick={handleClick}>Accept</button>
    </div>
  );
};

export default Contract;
