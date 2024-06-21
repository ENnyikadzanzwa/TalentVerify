import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Container, TextField, Button, Typography, Box, Paper, Grid } from '@mui/material';
import logo from '../../assets/logo.webp';  // Import the logo image

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please fill in both fields', {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        try {
            const response = await axiosInstance.post('/token/', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.access);

            const userResponse = await axiosInstance.get(`/users/${username}/`, {
                headers: {
                    Authorization: `Bearer ${response.data.access}`
                }
            });

            const userRole = userResponse.data.user_role;  // Adjust according to how your data is structured
            switch (userRole) {
                case 'company_admin':
                    navigate('/company-admin-dashboard');
                    break;
                case 'it_admin':
                    navigate('/it-admin-dashboard');
                    break;
                case 'auditor':
                    navigate('/auditor-dashboard');
                    break;
                case 'hr_manager':
                    navigate('/hr-manager-dashboard');
                    break;
                case 'company_executive':
                    navigate('/company-exec-dashboard');
                    break;
                case 'employee':
                    navigate('/employee-dashboard');
                    break;
                default:
                    navigate('/dashboard'); // Default dashboard
                    break;
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error('Invalid credentials, please try again.', {
                        position: "top-right"
                    });
                } else {
                    toast.error('Login failed: ' + error.response.data.detail, {
                        position: "top-right"
                    });
                }
            } else {
                toast.error('Network error, please try again.', {
                    position: "top-right"
                });
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
                <Box display="flex" justifyContent="center" mb={2}>
                    <img src={logo} alt="Talent Verify" style={{ width: '150px', height: 'auto' }} />
                </Box>
                <Typography component="h1" variant="h5" align="center">
                    Welcome to Talent Verify
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    Please sign in to continue
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, bgcolor: '#00bfff' }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography variant="body2">
                                Don't have an account? <a href="/register">Register</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
