import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const pages = [];
const settings = ["Profile", "Change Password", "Logout"];

function ResponsiveAppBar({ username }) {
  const navigate = useNavigate();
  //const history = useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [hasUnseenNotifications, setHasUnseenNotifications] =
    React.useState(false);

  React.useEffect(() => {
    const fetchUnseenNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/patient/getAllUnseenNotifications/${username}`
        );

        const unseenNotifications = response.data.data;
        const hasUnseen = unseenNotifications.some(
          (notification) => !notification.isSeen
        );
        setHasUnseenNotifications(hasUnseen);
      } catch (error) {
        console.error("Error fetching unseen notifications:", error.message);
      }
    };

    //fetchUnseenNotifications();
  }, [username]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
  };

  const handleUserMenu = async (text) => {
    switch (text) {
      case "Profile":
        navigate(
          localStorage.getItem("role").toLocaleLowerCase() === "doctor"
            ? "/Doctor_Profile"
            : "/Admin"
        );
        break;
      case "Account":
        navigate("/Admin/ViewAdmins");
        break;
      case "Dashboard":
        navigate("/Admin/ViewDoctors");
        break;
      case "Change Password":
        navigate("/ChangePassword");
        break;
      default: {
        const response = await fetch("/account/logout", { method: "GET" });
        const json = await response.json();
        if (response.ok) {
          //setToken();
          localStorage.setItem("token", "");
          localStorage.setItem("role", "");
          localStorage.setItem("username", "");
          navigate("/");
        }
      }
      
    }
  }

  const handleBellIconClick = () => {
    // Navigate to the notifications page or any other desired page
    const role= localStorage.getItem("role")
    console.log("H1"+role)
    if(role==="Patient"){
      navigate('/patient/notifications');
    }
    else{
    navigate("/Doctor_Home/notifications/");
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <IconButton
            size="large"
            aria-label="back"
            onClick={() => navigate(-1)} // Add this line
            color="inherit"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            El7a2ni Clinic
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
