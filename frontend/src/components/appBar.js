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
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const pages = [];
const settings = ["Profile", "Change Password", "Logout"];

function ResponsiveAppBar({ username }) {
  const navigate = useNavigate();
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

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "Profile") {
      navigate("/Doctor_Profile");
    }
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
    navigate("/Doctor_Home/notifications/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Button}
            onClick={() => navigate("/Doctor_Home")}
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
            EL7A2NI
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
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(
                      page === "Home" ? "/patient/" : `/patient/${page.toLowerCase()}`
                    );
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Button}
            onClick={() => navigate("/Doctor_Home")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            EL7A2NI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(page === "Home" ? "/patient/" : `/patient/${page.toLowerCase()}`)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

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
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "red",
                      borderRadius: "50%",
                      width: "10px",
                      height: "10px",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Doctor" src="/static/images/doc2.png" />
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
}

export default ResponsiveAppBar;
