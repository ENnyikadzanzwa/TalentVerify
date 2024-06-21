import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Container, TextField, Button } from '@mui/material';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify';

const CompanyProfile = () => {
    const [company, setCompany] = useState({
        company_name: '',
        registration_date: '',
        registration_number: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const userResponse = await axiosInstance.get('/me/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const companyId = userResponse.data.company_id;
                const companyResponse = await axiosInstance.get(`/companies/${companyId}/`);
                setCompany(companyResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching company data');
                setLoading(false);
            }
        };
        fetchCompany();
    }, []);

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userResponse = await axiosInstance.get('/me/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const companyId = userResponse.data.company_id;
            await axiosInstance.put(`/companies/${companyId}/`, company);
            toast.success('Company profile updated successfully.');
        } catch (err) {
            console.error('Error updating company profile:', err);
            toast.error('Error updating company profile.');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth="md">
            <Box mt={5}>
                <Card sx={{ borderRadius: '16px' }}>
                    <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                            Company Profile
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Company Name"
                                        name="company_name"
                                        value={company.company_name}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Registration Date"
                                        name="registration_date"
                                        type="date"
                                        value={company.registration_date}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Registration Number"
                                        name="registration_number"
                                        value={company.registration_number}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={company.address}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Contact Person"
                                        name="contact_person"
                                        value={company.contact_person}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Contact Phone"
                                        name="contact_phone"
                                        value={company.contact_phone}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={company.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Update Profile
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default CompanyProfile;
