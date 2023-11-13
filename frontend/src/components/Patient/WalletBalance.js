import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";


//get patient detials
const patientDetails = async (username) => {
  const res = await axios.get(`http://localhost:8000/patient/${username}`);
  return res.data.data;
};

//display the wallet balance of the patient
const WalletBalanceComp = ({ username }) => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPatient = async () => {
      const patientFromServer = await patientDetails(username);
      setPatient(patientFromServer);
      setLoading(false);
    };
    getPatient();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1>Wallet Balance</h1>
          <h2>{patient.walletBalance}</h2>
        </div>
      )}
    </div>
  );
};


export default WalletBalanceComp;