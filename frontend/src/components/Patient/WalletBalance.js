import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import { auth } from "../../pages/Protected/AuthProvider";

//get patient detials
const patientDetails = async (username) => {
  const res = await axios.get(`http://localhost:8000/patient/${username}`, {withCredentials: true});
  return res.data.data;
};

//display the wallet balance of the patient
const WalletBalanceComp = ({ username, refresh }) => {
  let show = false;
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);

  if (auth && localStorage.getItem("role") === "Patient") {
    show = true;
  }

  useEffect(() => {
    const getPatient = async () => {
      const patientFromServer = await patientDetails(username);
      setPatient(patientFromServer);
      setLoading(false);
    };
    getPatient();
  }, [refresh]);

  return (
    <div>
      {show ? (
        loading ? (
          <Loading />
        ) : (
          <div>
            <Card variant="outlined" sx={{ maxWidth: 400 }}>
              <Typography level="h1">Wallet Balance</Typography>
              <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              {patient.walletBalance} EGP
              </Typography>
              
            </Card>
          </div>
        )
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default WalletBalanceComp;
