// src/components/Dashboard/CompanyExecDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, BarChart as BarChartIcon, DataUsage as DataUsageIcon } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const drawerWidth = 240;

const CompanyExecDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('viewReports');
    const [exec, setExec] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const fetchExec = async () => {
            try {
                const response = await axiosInstance.get('/user/me/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setExec(response.data);
            } catch (error) {
                console.error('Error fetching executive data:', error);
            }
        };
        fetchExec();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'viewReports':
                return <div>View Reports</div>;
            case 'analyzeData':
                return <div>Analyze Employee Data</div>;
            default:
                return <div>View Reports</div>;
        }
    };

    const drawer = (
        <div>
            <Toolbar>
                <img src="/path/to/logo" alt="Talent Verify" style={{ width: '100%', height: 'auto', padding: '10px' }} />
            </Toolbar>
            <List>
                <ListItem button onClick={() => setActiveComponent('viewReports')}>
                    <ListItemIcon><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="View Reports" />
                </ListItem>
                <ListItem button onClick={() => setActiveComponent('analyzeData')}>
                    <ListItemIcon><DataUsageIcon /></ListItemIcon>
                    <ListItemText primary="Analyze Data" />
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
                        {exec ? `Welcome, ${exec.username}` : 'Executive Dashboard'}
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

export default CompanyExecDashboard;
