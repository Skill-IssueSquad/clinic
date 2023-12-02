// Import necessary components and libraries
import React, { useState, useEffect } from 'react';
import { Typography, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import NavBar from "../../components/navBar";
import PrescriptionsMultiLevelFilterTable from '../../components/PrescriptionsMultiLevelFilterTable';
import AddFamilyMember from '../../components/Patient/addFamilyMember';
import PatientDetails from '../../components/Patient/PatientDetails';
import LinkFamilyMemberForm from '../../components/Patient/linkFamilyMemberform';
import { auth } from '../Protected/AuthProvider';

const Patient = () => {
  let show = false;

  if (auth() && localStorage.getItem('role') === 'Patient') {
    show = true;
  }

  const [notification, setNotification] = useState(null);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
  };

  const [patient, setPatient] = useState(null);

  const submitFamMember = async (formData) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/patient/${localStorage.getItem('username')}/addFamMember`,
        formData
      );
      console.log(res.data);
      return { message: res.data.message };
    } catch (error) {
      console.log(error);
      return { message: error.message };
    }
  };

  const linkFamMember = async (formData) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/patient/${localStorage.getItem('username')}/linkFamMember`,
        formData
      );
      console.log(res.data);
      return { message: res.data.message };
    } catch (error) {
      console.log(error);
      return { message: error.message };
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/patient/${localStorage.getItem('username')}/subscriptions/cancel`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/patient/${localStorage.getItem('username')}`);
        setPatient(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatient();
  }, []); 

  if (!patient) return null;

  return (
    <div>
      {notification && (
        <div style={{ padding: '10px', backgroundColor: notification.isError ? 'red' : 'green', color: 'white' }}>
          {notification.message}
        </div>
      )}
      {show ? (
        <div className="patient">
          <NavBar name={"Patient Dashboard"} username={"bahyone"} />
          <PatientDetails
            patient={patient}
            handleCancelSubscription={handleCancelSubscription}
          />
          <p></p>
          <Typography variant="h6" gutterBottom borderLeft={15} borderColor={"white"}>
            Add Family Member
          </Typography>
          <AddFamilyMember onSubmit={submitFamMember} />
          <p></p>
          <Typography variant="h6" gutterBottom borderLeft={15} borderColor={"white"}>
            Link Family Member account
          </Typography>
          <LinkFamilyMemberForm onSubmit={linkFamMember} />
          <p></p>
          <PrescriptionsMultiLevelFilterTable
            columns={["doctor_name", "date", "isFilled", "View Prescriptions"]}
            API_GET_URL={`http://localhost:8000/patient/${localStorage.getItem('username')}/prescriptions`}
          />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Patient;
