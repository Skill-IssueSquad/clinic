import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { auth } from "../../pages/Protected/AuthProvider";

const PatientDetails = ({ patient, handleCancelSubscription }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [linkedAccs, setLinkedAccs] = useState([]); // New state for linked accounts
  const {
    username,
    name,
    email,
    dateOfBirth,
    gender,
    mobileNumber,
    emergencyContact,
    walletBalance,
    healthPackageType,
    creditCards,
    healthRecords,
    extfamilyMembers,
    linkedAccounts,
    perscreption_ids,
  } = patient;

  const isMainAccountUnsubscribed = healthPackageType.status === "unsubscribed";
  const isMainAccountCancelled = healthPackageType.status === "cancelled";
  const isMainAccountSubscribed = healthPackageType.status === "subscribed";

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const getLinkedAccounts = async () => {
    if (!linkedAccounts) return;
    let linkedAccountsToPatient = [];

    for (const linkedAcc of linkedAccounts) {
      console.log(linkedAcc.patient_id);
      const response = await axios.get(
        `http://localhost:8000/patient/getByID/${linkedAcc.patient_id}`
      );
      const data = response.data.data;
      console.log(data);
      linkedAccountsToPatient.push(data);
    }

    setLinkedAccs(linkedAccountsToPatient);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCancelSubscriptionClick = () => {
    // Call your function to handle subscription cancellation here
    handleCancelSubscription();
    handleDialogClose();
  };

  useEffect(() => {
    getLinkedAccounts();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            Username: {username}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date of Birth: {new Date(dateOfBirth).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Gender: {gender}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Mobile Number: {mobileNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Emergency Contact: {emergencyContact.fullName} -{" "}
            {emergencyContact.mobileNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Health Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            Wallet Balance: {walletBalance}
          </Typography>
          {isMainAccountUnsubscribed && (
            <Typography variant="body1" gutterBottom>
              Health Package Status: {healthPackageType.status}
            </Typography>
          )}
          {isMainAccountCancelled && (
            <>
              <Typography variant="body1" gutterBottom>
                Health Package End Date:{" "}
                {new Date(healthPackageType.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Status: {healthPackageType.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Type: {healthPackageType.type}
              </Typography>
            </>
          )}
          {isMainAccountSubscribed && (
            <>
              <Typography variant="body1" gutterBottom>
                Health Package Status: {healthPackageType.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Type: {healthPackageType.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Renewal:{" "}
                {new Date(healthPackageType.renewal).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDialogOpen}
                style={{ backgroundColor: "red" }}
              >
                Cancel Subscription
              </Button>
              <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Cancel Subscription</DialogTitle>
                <DialogContent>
                  <Typography variant="body1" gutterBottom>
                    Are you sure you want to cancel your health package
                    subscription?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="primary">
                    No
                  </Button>
                  <Button
                    onClick={handleCancelSubscriptionClick}
                    color="primary"
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          <Typography variant="body1" gutterBottom>
            Credit Cards:{" "}
            {creditCards.map((card) => (
              <div key={card.cardNum}>
                {card.cardHolderName} - {card.cardNum}
              </div>
            ))}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Health Records:{" "}
            {healthRecords.map((record) => (
              <div key={record.documentName}>{record.documentName}</div>
            ))}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Family Members
          </Typography>
          <Grid container spacing={3}>
            {extfamilyMembers.map((member) => {
              const isMemberUnsubscribed =
                member.healthPackageType.status === "unsubscribed";
              const isMemberCancelled =
                member.healthPackageType.status === "cancelled";
              const isMemberSubscribed =
                member.healthPackageType.status === "subscribed";

              return (
                <Grid item xs={12} sm={6} md={4} key={member.national_id}>
                  <Paper elevation={3} style={{ padding: "10px" }}>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Relation: {member.relation}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Age: {member.age}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      National ID: {member.national_id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Gender: {member.gender}
                    </Typography>
                    {isMemberUnsubscribed && (
                      <Typography variant="body1" gutterBottom>
                        Health Package Status: {member.healthPackageType.status}
                      </Typography>
                    )}
                    {isMemberCancelled && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          Health Package End Date:{" "}
                          {new Date(
                            member.healthPackageType.endDate
                          ).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Status:{" "}
                          {member.healthPackageType.status}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Type: {member.healthPackageType.type}
                        </Typography>
                      </>
                    )}
                    {isMemberSubscribed && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          Health Package Status:{" "}
                          {member.healthPackageType.status}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Type: {member.healthPackageType.type}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Renewal:{" "}
                          {new Date(
                            member.healthPackageType.renewal
                          ).toLocaleDateString()}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          <p></p>
          <Typography variant="h6" gutterBottom>
            Linked Accounts
          </Typography>
          <Grid container spacing={3}>
            {linkedAccs.map((acc) => {
              const isAccUnsubscribed =
                acc.healthPackageType.status === "unsubscribed";
              const isAccCancelled =
                acc.healthPackageType.status === "cancelled";
              const isAccSubscribed =
                acc.healthPackageType.status === "subscribed";

              return (
                <Grid item xs={12} sm={6} md={4} key={acc.username}>
                  <Paper elevation={3} style={{ padding: "10px" }}>
                    <Typography variant="h6" gutterBottom>
                      {acc.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      username: {acc.username}
                    </Typography>
                    {/* <Typography variant="body1" gutterBottom>
                      Relation: {acc.relation}
                    </Typography> */}
                    <Typography variant="body1" gutterBottom>
                      Age: {acc.age}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Gender: {acc.gender}
                    </Typography>
                    {isAccUnsubscribed && (
                      <Typography variant="body1" gutterBottom>
                        Health Package Status: {acc.healthPackageType.status}
                      </Typography>
                    )}
                    {isAccCancelled && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          Health Package End Date:{" "}
                          {new Date(
                            acc.healthPackageType.endDate
                          ).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Status: {acc.healthPackageType.status}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Type: {acc.healthPackageType.type}
                        </Typography>
                      </>
                    )}
                    {isAccSubscribed && (
                      <>
                        <Typography variant="body1" gutterBottom>
                          Health Package Status: {acc.healthPackageType.status}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Type: {acc.healthPackageType.type}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Health Package Renewal:{" "}
                          {new Date(
                            acc.healthPackageType.renewal
                          ).toLocaleDateString()}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatientDetails;
