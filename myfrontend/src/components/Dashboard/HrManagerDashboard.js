// src/components/Dashboard/HrManagerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Person as PersonIcon, Publish as PublishIcon } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';
import logo from '../../assets/logo.webp';
const drawerWidth = 240;

const HrManagerDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('manageEmployees');
    const [hrManager, setHrManager] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const fetchHrManager = async () => {
            try {
                const response = await axiosInstance.get('/me/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setHrManager(response.data);
            } catch (error) {
                console.error('Error fetching HR manager data:', error);
            }
        };
        fetchHrManager();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'manageEmployees':
                return <div>Manage Employee Records</div>;
            case 'bulkUpload':
                return <div>Bulk Upload Employee Data</div>;
            default:
                return <div>Manage Employee Records</div>;
        }
    };

    const drawer = (
        <div>
            <Toolbar>
                 <img src={logo} alt="Talent Verify" style={{ width: '100%', height: 'auto', padding: '10px' }} />
            </Toolbar>
            <List>
                <ListItem button onClick={() => setActiveComponent('manageEmployees')}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Manage Employees" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('bulkUpload')}>
                    <ListItemIcon><PublishIcon /></ListItemIcon>
                    <ListItemText primary="Bulk Upload" />
                </ListItem>
            </List>
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
                        {hrManager ? `Welcome, ${hrManager.username}` : 'HR Manager Dashboard'}
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

export default HrManagerDashboard;
