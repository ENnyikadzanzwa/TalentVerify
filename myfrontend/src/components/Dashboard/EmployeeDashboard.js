import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Work as WorkIcon, Business as BusinessIcon, Group as GroupIcon, ExitToApp as ExitToAppIcon, Person as PersonIcon } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';
import EmployeeProfile from '../Employees/EmployeeProfile';
import EmployeeDuties from '../Employees/EmployeeDuties';
import EmployeeExperience from '../Employees/EmployeeExperience';
import EmployeeCompanyProfile from '../Employees/EmployeeCompanyProfile';
import DepartmentEmployees from '../Employees/DepartmentEmployees';
import logo from '../../assets/logo.webp'; // Import the logo image
import { toast } from 'react-toastify';

const drawerWidth = 240;

const EmployeeDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('profile');
    const [employee, setEmployee] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully', { position: toast.POSITION.TOP_RIGHT });
        window.location.href = '/login';
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axiosInstance.get('/me/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };
        fetchEmployee();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'profile':
                return <EmployeeProfile />;
            case 'duties':
                return <EmployeeDuties />;
            case 'experience':
                return <EmployeeExperience />;
            case 'companyProfile':
                return <EmployeeCompanyProfile />;
            case 'departmentEmployees':
                return <DepartmentEmployees />;
            default:
                return <EmployeeProfile />;
        }
    };

    const drawer = (
        <div>
            <Toolbar>
                <img src={logo} alt="Talent Verify" style={{ width: '100%', height: 'auto', padding: '10px' }} />
            </Toolbar>
            <List>
                <ListItem button onClick={() => setActiveComponent('profile')}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('duties')}>
                    <ListItemIcon><WorkIcon /></ListItemIcon>
                    <ListItemText primary="Duties" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('experience')}>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Experience" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('companyProfile')}>
                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                    <ListItemText primary="Company Profile" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('departmentEmployees')}>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary="Department Employees" />
                </ListItem>
            </List>
            <Divider />
            <ListItem button onClick={handleLogout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
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
                        {employee ? `Welcome, ${employee.username}` : 'Employee Dashboard'}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
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
        </Box>
    );
};

export default EmployeeDashboard;
