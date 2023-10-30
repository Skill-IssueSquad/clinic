const Contract = ({ markup, hourlyRate, netRate, setIsAccepted }) => {
  return (
    <div>
      <h1>Contract</h1>
      <p>Markup: {markup}</p>
      <p>Hourly Rate: {hourlyRate}</p>
      <p>Net Rate: {netRate}</p>
      <button onClick={setIsAccepted(true)}>Accept</button>
    </div>
  );
};

export default Contract;
