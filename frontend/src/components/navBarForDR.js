import * as React from 'react';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const pages = ['Home', 'Doctors', 'Appointments', 'Medical History', 'Health Packages'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = ({ username }) => {
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [hasUnseenNotifications, setHasUnseenNotifications] = React.useState(false);

  useEffect(() => {
    const fetchUnseenNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/patient/getAllUnseenNotifications/${username}`
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
          {/* Your existing JSX code here */}

          <Box sx={{ flexGrow: 1 }} />

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

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
