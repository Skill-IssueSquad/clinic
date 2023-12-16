import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Slide, Paper, Divider, IconButton } from "@mui/material";
import NavBar from "../../components/navBarPatient";
import AddFamilyMember from "../../components/Patient/addFamilyMember";
import PatientDetails from "../../components/Patient/PatientDetails";
import LinkFamilyMemberForm from "../../components/Patient/linkFamilyMemberform";
import { auth } from "../Protected/AuthProvider";

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
  const [addFamilyMemberVisible, setAddFamilyMemberVisible] = useState(false);
  const [linkFamilyMemberVisible, setLinkFamilyMemberVisible] = useState(false);

  const submitFamMember = async (formData) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/patient/${localStorage.getItem(
          "username"
        )}/addFamMember`,
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
        `http://localhost:8000/patient/${localStorage.getItem(
          "username"
        )}/linkFamMember`,

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
        `http://localhost:8000/patient/${localStorage.getItem(
          "username"
        )}/subscriptions/cancel`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        await axios
          .get(
            `http://localhost:8000/patient/${localStorage.getItem("username")}`
          , {withCredentials: true})
          .then((res) => {
            setPatient(res.data.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatient();
  }, [() => submitFamMember, () => linkFamMember,  () => handleCancelSubscription]); // Empty dependency array to run once on component mount

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
          <NavBar
            name={"Patient Dashboard"}
            username={localStorage.getItem("username")}
            button = {"Profile"}
          />
          <PatientDetails
            patient={patient}
            handleCancelSubscription={handleCancelSubscription}
          />
          <Divider />
          <Typography
            variant="h6"
            gutterBottom
            borderLeft={15}
            borderColor={"white"}
            onClick={() => setAddFamilyMemberVisible(!addFamilyMemberVisible)}
            style={{ cursor: "pointer" }}
          >
            Add Family Member
          </Typography>
          <Slide
            direction="down"
            in={addFamilyMemberVisible}
            mountOnEnter
            unmountOnExit
          >
            <Paper>
              <AddFamilyMember onSubmit={submitFamMember} />
            </Paper>
          </Slide>
          <Divider />
          <Typography
            variant="h6"
            gutterBottom
            borderLeft={15}
            borderColor={"white"}
            onClick={() => setLinkFamilyMemberVisible(!linkFamilyMemberVisible)}
            style={{ cursor: "pointer" }}
          >
            Link Family Member account
          </Typography>
          <Slide
            direction="down"
            in={linkFamilyMemberVisible}
            mountOnEnter
            unmountOnExit
          >
            <Paper>
              <LinkFamilyMemberForm onSubmit={linkFamMember} />
            </Paper>
          </Slide>
          <Divider />
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Patient;
