import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, Group as GroupIcon, Add as AddIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import CompanyHomePage from '../Companies/CompanyHomePage';
import CompanyProfile from '../Companies/CompanyProfile';
import AddEmployee from '../Employees/AddEmployee';
import ManageDepartments from '../Departments/ManageDepartments';
import EmployeeList from '../Employees/EmployeeList'; // Import the EmployeeList component
import logo from '../../assets/logo.webp'; // Import the logo image

const drawerWidth = 240;

const CompanyAdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('home');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('You have been successfully logged out.', {
      position: "top-right",
      autoClose: 2000,
    });
    navigate('/login');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <CompanyHomePage />;
      case 'profile':
        return <CompanyProfile />;
      case 'addEmployee':
        return <AddEmployee />;
      case 'departments':
        return <ManageDepartments />;
      case 'employees':
        return <EmployeeList />;
      default:
        return <CompanyHomePage />;
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <img src={logo} alt="Talent Verify" style={{ width: '100%', height: 'auto', padding: '10px' }} />
      </Toolbar>
      <List>
        <ListItem button onClick={() => setActiveComponent('home')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => setActiveComponent('profile')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Company Profile" />
        </ListItem>
        <ListItem button onClick={() => setActiveComponent('addEmployee')}>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="Add Employee" />
        </ListItem>
        <ListItem button onClick={() => setActiveComponent('departments')}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Manage Departments" />
        </ListItem>
        <ListItem button onClick={() => setActiveComponent('employees')}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="View Employees" />
        </ListItem>
      </List>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Company Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {renderComponent()}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default CompanyAdminDashboard;
