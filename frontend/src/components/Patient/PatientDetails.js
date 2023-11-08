import React from "react";
import { Typography, Grid, Paper } from "@mui/material";

const PatientDetails = ({ patient }) => {
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

  const isHealthPackageUnsubscribed =
    healthPackageType.status === "unsubscribed";

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
          {healthPackageType.status === "unsubscribed" ||
          healthPackageType.status === "cancelled" ? (
            <Typography variant="body1" gutterBottom>
              Health Package Status: {healthPackageType.status}
            </Typography>
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                Health Package Type: {healthPackageType.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Status: {healthPackageType.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package Renewal:{" "}
                {new Date(healthPackageType.renewal).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Health Package End Date:{" "}
                {new Date(healthPackageType.endDate).toLocaleDateString()}
              </Typography>
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
            {extfamilyMembers.map((member) => (
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
                  {member.healthPackageType.status === "unsubscribed" ||
                  member.healthPackageType.status === "cancelled" ? (
                    <Typography variant="body1" gutterBottom>
                      Health Package Status: {member.healthPackageType.status}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1" gutterBottom>
                        Health Package Type: {member.healthPackageType.type}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Health Package Status: {member.healthPackageType.status}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Health Package Renewal:{" "}
                        {new Date(
                          member.healthPackageType.renewal
                        ).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Health Package End Date:{" "}
                        {new Date(
                          member.healthPackageType.endDate
                        ).toLocaleDateString()}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatientDetails;
