const Contract = ({ hourlyRate, setContractAccepted }) => {
  const markup = 0.2;
  const handleClick = () => {
    setContractAccepted(true);
  };

  return (
    <div>
      <h1>Contract</h1>
      <p>Markup: {markup}</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <button onClick={handleClick}>Accept</button>
    </div>
  );
};

export default Contract;
