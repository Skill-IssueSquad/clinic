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
    navigate('/patient/notifications');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Patient Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => {
              let url = "/patient/"
              if (page === "Home") {
                url = "/patient/"
              } else if (page === "Doctors") {
                url = "/patient/doctors"
              } else if (page === "Appointments") {
                url = "/patient/appointments"
              } else if (page === "Medical History") {
                url =
                  `/patient/medicalHistory/?PUN=${
                    username
                  }&IP=${true}`
              } else if (page == "Health Packages") {
                url = "/patient/healthPackages/"
              }
              return (
                <Button
                  key={page}
                  onClick={() => navigate(url)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>)
            })}
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
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
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
