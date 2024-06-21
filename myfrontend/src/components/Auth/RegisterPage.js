import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Container, TextField, Button, Typography, Box, Paper, Grid } from '@mui/material';
import logo from '../../assets/logo.webp';  // Import the logo image
import './RegisterPage.css';  // Import the custom CSS file for scrollbar styling

const RegisterPage = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        company_name: '',
        registration_date: '',
        registration_number: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        email: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/register/', user);
            console.log('User created:', response.data);
            toast.success('Registration successful. Please login.', {
                position: "top-right"
            });
            navigate('/login');
        } catch (error) {
            if (error.response) {
                toast.error('Error registering user: ' + error.response.data.detail, {
                    position: "top-right"
                });
                console.error('Error registering user:', error.response.data);
            } else {
                toast.error('Error registering user', {
                    position: "top-right"
                });
                console.error('Error registering user', error);
            }
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} className="custom-scroll" sx={{ padding: 3, marginTop: 8, width: '80%', maxHeight: '80vh', overflowY: 'auto' }}>
                <Box display="flex" justifyContent="center" mb={2}>
                    <img src={logo} alt="Talent Verify" style={{ width: '150px', height: 'auto' }} />
                </Box>
                <Typography component="h1" variant="h5" align="center">
                    Register Your Company
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    Join Talent Verify - Your online employee management assistant.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Company Name"
                                name="company_name"
                                value={user.company_name}
                                onChange={handleChange}
                                autoFocus
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Registration Date"
                                name="registration_date"
                                type="date"
                                value={user.registration_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Registration Number"
                                name="registration_number"
                                value={user.registration_number}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Address"
                                name="address"
                                value={user.address}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Contact Person"
                                name="contact_person"
                                value={user.contact_person}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Contact Phone"
                                name="contact_phone"
                                value={user.contact_phone}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={handleChange}
                                sx={{ bgcolor: '#f0f0f0' }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, bgcolor: '#00bfff' }}
                    >
                        Register
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography variant="body2">
                                Already have an account? <a href="/login">Login</a>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
