import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/joy/CircularProgress";
import axios from "axios";

export default function ContactSplitButton({
  canContact,
  patientId,
  doctorId,
  doctorUsername,
}) {
  const navigate = useNavigate();
  const options = !canContact
    ? ["No Actions"]
    : ["Select Action", "Chat", "Video Call"]
  const [open, setOpen] = React.useState(false);
  const [diagOpen, setDiagOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [diagLoading, setDiagLoading] = React.useState(false);
  const [cancelMsg, setCancelMsg] = React.useState(null);
  const [showClose, setShowClose] = React.useState(false);

  const handleClick = () => {
    if (canContact) {
      if (options[selectedIndex] === "Chat") {
        navigate("/Doctor_Chat", { state: { username: doctorUsername } });
      } else if (options[selectedIndex] === "Video Call") {
        navigate(`/videoCall/${String(patientId)}${String(doctorId)}`)
      }  else if (options[selectedIndex] === "Select Action") {
        toggleOptions();
      }
    }
  };


  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const toggleOptions = () => {
    setOpen(!open);
  };

  const handleDiagOpen = () => {
    setDiagOpen(true);
  };

  const handleDiagClose = () => {
    setDiagOpen(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    setDiagOpen(false);
  }


  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button onClick={handleClick} color="primary" disabled={!canContact}>
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          disabled={!canContact}
          color="primary"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={!canContact}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
