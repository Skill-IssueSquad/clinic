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

export default function AppointmentSplitButton({
  appointment,
  old,
  doctor_id,
  appointment_id,
  none,
  refresh,
  canBook,
  pending
}) {
  const navigate = useNavigate();
  none = none || (old && !appointment);
  const options = none
    ? ["No Actions"]
    : appointment
    ? [
        "Select Action",
        old ? "Request Follow-up" : "Reschedule Appointment",
        ...(old ? [] : ["Cancel"]),
      ]
    : pending ? ["Select Action", "Pay", "Cancel"]: ["Select Action", ...(old ? ["Cancel"] : [])];

  let clr = "";
  const [open, setOpen] = React.useState(false);
  const [diagOpen, setDiagOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [diagLoading, setDiagLoading] = React.useState(false);
  const [cancelMsg, setCancelMsg] = React.useState(null);
  const [showClose, setShowClose] = React.useState(false);

  const handleClick = () => {
    if (canBook || options[selectedIndex] === "Cancel" || pending) {
      if (options[selectedIndex] === "Reschedule Appointment") {
        navigate(`/patient/rescheduleSlot/${doctor_id}/${appointment_id}`);
      } else if (options[selectedIndex] === "Request Follow-up") {
        navigate(`/patient/requestFollowUp/${doctor_id}/${appointment_id}`);
      } else if (options[selectedIndex] === "Cancel") {
        handleDiagOpen();
      } else if (options[selectedIndex] === "Select Action") {
        openOptions();
      } else if (options[selectedIndex] === "Pay") {
        handleDocPay();
      }
    } else {
      handleDiagOpen();
    }
  };

  const handleDocPay = async () => {
    const res = await axios.post(
      `http://localhost:8000/patient/${localStorage.getItem("username")}/docFollowUpPay`, {doctor_id, appointment_id}
    );

    if (res.data.success) {
      refresh(true);
    }
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const openOptions = () => {
    setOpen(true);
  };

  const handleDiagOpen = () => {
    setDiagOpen(true);
  };

  const handleDiagClose = () => {
    setDiagOpen(false);
  };

  const handleClose = (choice) => {
    if (choice === "yes") {
      setDiagLoading(true);
      try {
        axios
          .delete(
            `http://localhost:8000/patient/${localStorage.getItem(
              "username"
            )}/appointments/${doctor_id}/${appointment_id}`
          )
          .then((res) => {
            setDiagLoading(false);

            setCancelMsg(res.data.message);

            setShowClose(true);
          })
          .catch((err) => {
            setDiagLoading(false);
            setCancelMsg(err.message);
            setShowClose(true);
          });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } else {
      setDiagOpen(false);
      setShowClose(false);
      setCancelMsg(null);
      if (choice === "close") {
        refresh(true);
      }
    }
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        {options[selectedIndex] === "Cancel"
          ? (clr = "error")
          : (clr = "primary")}
        <Button onClick={handleClick} color={clr} disabled={none}>
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          disabled={none}
          color={clr}
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
                      disabled={none}
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
      <Dialog
        open={diagOpen}
        onClose={handleDiagClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {canBook  || options[selectedIndex] === "Cancel" ? "Appointment Cancellation": "Action Blocked"}
        </DialogTitle>
        <DialogContent>
          {canBook || options[selectedIndex] === "Cancel"? (
            !diagLoading && cancelMsg == null ? (
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this appointment?
              </DialogContentText>
            ) : cancelMsg !== null ? (
              <DialogContentText id="alert-dialog-description">
                {cancelMsg}
              </DialogContentText>
            ) : (
              <DialogContentText id="alert-dialog-description">
                cancelling...
              </DialogContentText>
            )
          ) : (
            <DialogContentText id="alert-dialog-description">
              Please pay any pending follow-up fees or cancel them to proceed.
            </DialogContentText>
          )}

          {diagLoading && <CircularProgress variant="solid" />}
        </DialogContent>
        <DialogActions>
          {canBook || options[selectedIndex] === "Cancel" ? (
            !showClose ? (
              <div>
                <Button onClick={() => handleClose("no")}>No</Button>
                <Button onClick={() => handleClose("yes")} autoFocus>
                  Yes
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleClose("close")}>Close</Button>
            )
          ) : (
            <Button onClick={() => handleClose("jclose")}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
