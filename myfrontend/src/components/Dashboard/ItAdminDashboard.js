// src/components/Dashboard/ItAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Lock as LockIcon, VerifiedUser as VerifiedUserIcon, Security as SecurityIcon } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const drawerWidth = 240;

const ItAdminDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('manageEncryption');
    const [itAdmin, setItAdmin] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const fetchItAdmin = async () => {
            try {
                const response = await axiosInstance.get('/me/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setItAdmin(response.data);
            } catch (error) {
                console.error('Error fetching IT admin data:', error);
            }
        };
        fetchItAdmin();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'manageEncryption':
                return <div>Manage Data Encryption</div>;
            case 'manageRoles':
                return <div>Manage User Roles</div>;
            case 'securityTests':
                return <div>Perform Security Tests</div>;
            default:
                return <div>Manage Data Encryption</div>;
        }
    };

    const drawer = (
        <div>
            <Toolbar>
                <img src="/path/to/logo" alt="Talent Verify" style={{ width: '100%', height: 'auto', padding: '10px' }} />
            </Toolbar>
            <List>
                <ListItem button onClick={() => setActiveComponent('manageEncryption')}>
                    <ListItemIcon><LockIcon /></ListItemIcon>
                    <ListItemText primary="Manage Encryption" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('manageRoles')}>
                    <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
                    <ListItemText primary="Manage Roles" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('securityTests')}>
                    <ListItemIcon><SecurityIcon /></ListItemIcon>
                    <ListItemText primary="Security Tests" />
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
                        {itAdmin ? `Welcome, ${itAdmin.username}` : 'IT Admin Dashboard'}
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

export default ItAdminDashboard;
