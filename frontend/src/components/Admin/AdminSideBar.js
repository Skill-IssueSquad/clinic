import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminIcon from '@mui/icons-material/ManageAccounts'
import PatientIcon from '@mui/icons-material/People'
import DoctorIcon from '@mui/icons-material/HealthAndSafety'
import RequestIcon from '@mui/icons-material/AddCircle'
import PackagesIcon from '@mui/icons-material/MedicalInformation'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const settings = ['Profile', "Change Password", 'Logout'];

export default function PersistentDrawerLeft({flag, ViewComponent, item}) {
  const navigate = useNavigate();
  //const {setToken} = useAuth();
  const theme = useTheme();
  const [open, setOpen] = React.useState(flag);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [selected, setSelected] = React.useState(item);
  const [viewComponent, setViewComponent] = React.useState(ViewComponent);


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  }

  const handleClickAdmin = (text) => {
    //console.log(text);
    setSelected(text);
    localStorage.setItem('selectedItem',text);    
    switch(text){
      case "Dashboard": navigate("/Admin"); setOpen(false); break;
      case "View Admins": navigate("/Admin/ViewAdmins") ;setOpen(false); break;
      case "View Doctors": navigate("/Admin/ViewDoctors"); setOpen(false); break;
      case "View Patients":  navigate("/Admin/ViewPatients"); setOpen(false); break;
      case "View Join Requests":  navigate("/Admin/ViewRequests"); setOpen(false); break;
      default: navigate("/Admin/ViewPackages"); setOpen(false);
    }
  }

  const handleUserMenu = async (text) => {
    switch(text){
      //add profile page
      case "Profile": navigate('/Admin'); break;
      case "Change Password": navigate('/ChangePassword'); break;
      default: {
        const response = await fetch('/account/logout', {method: 'GET', credentials: 'include',});
        const json = await response.json();
        if (response.ok){
          //setToken();
          localStorage.setItem('token','');
          localStorage.setItem('role','');
          localStorage.setItem('username', '');
          navigate('/');
        }
      };
    }
  }

  useEffect(() => {
    // Retrieve selected item from localStorage on component mount
    const storedSelected = localStorage.getItem('selectedItem');
    if (storedSelected) {
      setSelected(storedSelected);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography   
            variant="h6"
            noWrap
            component="a"
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
            El7a2ni Clinic
          </Typography>
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ position: 'absolute', top:'5px', right:'10px'}}>
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
              {settings.map((text) => (
                <MenuItem key={text} onClick={() => handleUserMenu(text)}>
                  <Typography textAlign="center">{text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            //backgroundColor: 'rgba(200,0, 255, 0.8)'
            //style={{
              backgroundColor: 'rgba(10,52, 99, 1)'
          //}}
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} style={{color: 'white'}}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          {['Dashboard', 'View Admins','View Doctors', 'View Patients','View Join Requests', 'View Health Packages'].map((text, index) => (
            <ListItem key={text} disablePadding selected= {selected===text} style={{color:'white', fontSize:'10px'}} sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgb(255,255,255,0.2)', // Change 'yourSelectedColor' to your desired color
                color: 'white',
              },
              fontSize: '10px',
            }}>
              <ListItemButton onClick={() => handleClickAdmin(text)}>
                <ListItemIcon style={{color:'white'}}>
                  {index===0? <DashboardIcon/> : 
                    (index===1? <AdminIcon/> : 
                    (index===2? <DoctorIcon/>: 
                    (index===3? <PatientIcon/>  : 
                    (index===4? <RequestIcon/> : <PackagesIcon/>))))}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
      </Drawer>
      <Main open={open}>
        {viewComponent}
      </Main>
    </Box>
  );
}