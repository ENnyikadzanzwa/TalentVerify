import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Typography, Paper, Box } from '@mui/material';

const EmployeeProfile = () => {
    const [employee, setEmployee] = useState(null);

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

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Employee Profile
                </Typography>
                <Box>
                    <Typography variant="body1"><strong>Name:</strong> {employee.username}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {employee.email}</Typography>
                    <Typography variant="body1"><strong>Employee Number:</strong> {employee.employee_number}</Typography>
                    <Typography variant="body1"><strong>Role:</strong> {employee.user_role}</Typography>
                    <Typography variant="body1"><strong>Department:</strong> {employee.department_name}</Typography>
                    <Typography variant="body1"><strong>Start Date:</strong> {employee.start_date}</Typography>
                    <Typography variant="body1"><strong>Gender:</strong> {employee.gender}</Typography>
                    <Typography variant="body1"><strong>Date of Birth:</strong> {employee.date_of_birth}</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default EmployeeProfile;
