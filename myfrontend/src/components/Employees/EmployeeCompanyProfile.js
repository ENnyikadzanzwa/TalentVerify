// src/components/Employees/EmployeeCompanyProfile.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import axiosInstance from '../../axiosConfig';

const EmployeeCompanyProfile = () => {
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await axiosInstance.get('/company/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCompany(response.data);
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        };
        fetchCompanyDetails();
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {company ? (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Company Profile
                        </Typography>
                        <Box>
                            <Typography variant="body1"><strong>Name:</strong> {company.company_name}</Typography>
                            <Typography variant="body1"><strong>Registration Date:</strong> {company.registration_date}</Typography>
                            <Typography variant="body1"><strong>Registration Number:</strong> {company.registration_number}</Typography>
                            <Typography variant="body1"><strong>Address:</strong> {company.address}</Typography>
                            <Typography variant="body1"><strong>Contact Person:</strong> {company.contact_person}</Typography>
                            <Typography variant="body1"><strong>Contact Phone:</strong> {company.contact_phone}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {company.email}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Typography>Loading company details...</Typography>
            )}
        </Container>
    );
};

export default EmployeeCompanyProfile;
