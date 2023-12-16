import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import AccountIcon from '@mui/icons-material/AccountCircle'
import { useEffect } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

let pages = [
  "Profile",
  "Doctors",
  "Appointments",
  "Medical History",
  "Health Packages",
  "Prescriptions",
  "Change Password"
];
const settings = ["Logout"];

const ResponsiveAppBar = ({ username, button }) => {
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [hasUnseenNotifications, setHasUnseenNotifications] = React.useState(false);

  useEffect(() => {
    const fetchUnseenNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/patient/getAllUnseenNotifications/${username}`,
          {withCredentials:true},
        );
        const unseenNotifications = response.data.data;
        const hasUnseen = unseenNotifications.some(notification => !notification.isSeen);
        setHasUnseenNotifications(hasUnseen);

      } catch (error) {
        console.error("Error fetching unseen notifications:", error.message);
      }
    };

    fetchUnseenNotifications();
    
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenu = async (text) => {
    switch (text) {
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
  };
  
  const handleBellIconClick = () => {
    // Navigate to the notifications page or any other desired page
    const role= localStorage.getItem("role")
    if(role==="Patient"){
      navigate('/patient/notifications');
    }
    else{
    navigate("/Doctor_Home/notifications/");
    }  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
            component="a"
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              let url = "/patient/";
              if (page === "Profile") {
                url = "/patient/";
              } else if (page === "Doctors") {
                url = "/patient/doctors";
              } else if (page === "Appointments") {
                url = "/patient/appointments";
              } else if (page === "Medical History") {
                url = `/patient/medicalHistory/?PUN=${username}&IP=${true}`;
              } else if (page == "Health Packages") {
                url = "/patient/healthPackages/";
              } else if (page == "Prescriptions") {
                url = "/patient/prescriptions/";
              }
              else if (page == "Change Password") {
                url = "/patient/changePassword/";
              }
              return (
                <Button
                  key={page}
                  onClick={() => navigate(url)}
                  sx={{ my: 2, color: "black", display: "block" }}
                  style={{fontSize:'14px', margin:'10px', marginTop: '20px', 
                  backgroundColor: button === page? 'white' : 'transparent'}}
                >
                  {page}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Notifications">
              <IconButton
                aria-label="notifications"
                color="inherit"
                onClick={handleBellIconClick} 
              >
                <NotificationsIcon />
                {hasUnseenNotifications && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'red',
                      borderRadius: '50%',
                      width: '10px',
                      height: '10px',
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <AccountIcon style={{color:'white'}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((text) => (
                <MenuItem key={text} onClick={() => handleUserMenu(text)}>
                  <Typography textAlign="center">{text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
