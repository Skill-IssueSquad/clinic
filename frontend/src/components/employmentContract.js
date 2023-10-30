const Contract = ({ props }) => {
  const { markup, hourlyRate, netRate, setContractAccepted } = props;
  const handleClick = () => {
    setContractAccepted(true);
  };

  return (
    <div>
      <h1>Contract</h1>
      <p>Markup: {markup}</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <p>Net Rate: {netRate}</p>
      <button onClick={handleClick}>Accept</button>
    </div>
  );
};

export default Contract;
