import React, { useState } from "react";
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

const HealthPackageOptions = () => {
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const availablePackages = [
    {
      name: "Silver Package",
      description:
        "Patient pays 3600 LE per year and gets 40% off any doctor's session price and 20% off any medicine ordered from the pharmacy platform and 10% discount on the subscription of any of his family members in any package",
    },
    {
      name: "Gold Package",
      description:
        "Patient pays 6000 LE per year and gets 60% off any doctor's session price and 30% off any medicine ordered from the pharmacy platform and 15% discount on the subscription of any of his family members in any package",
    },
    {
      name: "Platinum Package",
      description:
        "Patient pays 9000 LE per year and gets 80% off any doctor's session price and 40% off any medicine ordered from the pharmacy platform and 20% discount on the subscription of any of his family members in any package",
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePurchase = () => {
    // Implement the logic to redirect to the payments page with selected packages and family members' details.
    // You can use react-router or another routing solution for this.
    // Redirect code here...
  };

  return (
    <div>
      <h2>Health Packages</h2>
      <List>
        {availablePackages.map((healthPackage, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={healthPackage.name}
              secondary={healthPackage.description}
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={selectedPackages.includes(index)}
                onChange={() => handleSelectPackage(index)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleOpenDialog}>
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

export default HealthPackageOptions;
