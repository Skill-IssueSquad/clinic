import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@mui/material";
import axios from "axios";

const packageItemStyle = {
  backgroundColor: "white",
  marginBottom: "16px",
  border: "1px solid #eee",
  borderRadius: "4px",
};

const packageTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const packageDescriptionStyle = {
  fontSize: "0.9rem",
};

const purchaseButtonStyle = {
  marginTop: "16px",
};

const HealthPackages = () => {
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);

  // Fetch family members from the backend when the component mounts
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        // Replace with your backend endpoint for fetching family members
        const response = await axios.get(
          "http://localhost:8000/patient/bahyone/getFamMember"
        );
        const data = response.data.data;
        setFamilyMembers(data);
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const availablePackages = [
    {
      name: "Silver Package",
      description:
        "You pay 3600 LE per year and gets 40% off any doctor's session price and 20% off any medicine ordered from the pharmacy platform and 10% discount on the subscription of any of his family members in any package",
    },
    {
      name: "Gold Package",
      description:
        "You pay 6000 LE per year and gets 60% off any doctor's session price and 30% off any medicine ordered from the pharmacy platform and 15% discount on the subscription of any of his family members in any package",
    },
    {
      name: "Platinum Package",
      description:
        "You pay 9000 LE per year and gets 80% off any doctor's session price and 40% off any medicine ordered from the pharmacy platform and 20% discount on the subscription of any of his family members in any package",
    },
  ];

  const handleSelectPackage = (packageIndex) => {
    const newSelectedPackages = [...selectedPackages];
    if (newSelectedPackages.includes(packageIndex)) {
      newSelectedPackages.splice(newSelectedPackages.indexOf(packageIndex), 1);
    } else {
      newSelectedPackages.push(packageIndex);
    }
    setSelectedPackages(newSelectedPackages);
  };

  const handleSelectFamilyMember = (familyMember) => {
    const newSelectedFamilyMembers = [...selectedFamilyMembers];
    if (newSelectedFamilyMembers.includes(familyMember)) {
      newSelectedFamilyMembers.splice(
        newSelectedFamilyMembers.indexOf(familyMember),
        1
      );
    } else {
      newSelectedFamilyMembers.push(familyMember);
    }
    setSelectedFamilyMembers(newSelectedFamilyMembers);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePurchase = () => {
    // Implement the logic to proceed to the payment page with selected packages and family members' details.
    // You can use react-router or another routing solution for this.
    // Redirect code here...
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>Health Packages</h2>
      {availablePackages.map((healthPackage, index) => (
        <div key={index} style={packageItemStyle}>
          <ListItem button onClick={() => handleSelectPackage(index)}>
            <ListItemText
              primary={
                <span style={packageTitleStyle}>{healthPackage.name}</span>
              }
              secondary={
                <span style={packageDescriptionStyle}>
                  {healthPackage.description}
                </span>
              }
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={selectedPackages.includes(index)}
                onChange={() => handleSelectPackage(index)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </div>
      ))}
      <Button
        style={purchaseButtonStyle}
        variant="contained"
        onClick={handleOpenDialog}
        disabled={selectedPackages.length === 0}
      >
        Purchase
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Selected Packages</DialogTitle>
        <DialogContent>
          <List>
            {selectedPackages.map((index) => (
              <ListItem key={index}>
                <ListItemText primary={availablePackages[index].name} />
              </ListItem>
            ))}
          </List>
          {/* <DialogTitle>Family Members</DialogTitle>
          <List>
            {familyMembers.map((familyMember) => (
              <ListItem key={familyMember.name}>
                <ListItemText
                  primary={`Name: ${familyMember.name}`}
                  secondary={`Relation: ${familyMember.relation}, Age: ${familyMember.age}, Gender: ${familyMember.gender}`}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    checked={selectedFamilyMembers.includes(familyMember)}
                    onChange={() => handleSelectFamilyMember(familyMember)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePurchase} variant="contained" color="primary">
            Proceed to Payment
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HealthPackages;
