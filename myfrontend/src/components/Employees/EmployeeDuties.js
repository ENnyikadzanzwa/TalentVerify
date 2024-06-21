import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, TextField, Button, Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const EmployeeDuties = () => {
    const [duty, setDuty] = useState('');
    const [duties, setDuties] = useState([]);

    useEffect(() => {
        const fetchDuties = async () => {
            try {
                const response = await axiosInstance.get('/duties/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDuties(response.data);
            } catch (error) {
                console.error('Error fetching duties:', error);
            }
        };
        fetchDuties();
    }, []);

    const handleAddDuty = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/duties/', { duty }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDuties([...duties, response.data]);
            setDuty('');
        } catch (error) {
            console.error('Error adding duty:', error);
        }
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Duties
                </Typography>
                <Box component="form" onSubmit={handleAddDuty}>
                    <TextField
                        label="Duty"
                        value={duty}
                        onChange={(e) => setDuty(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, bgcolor: '#00bfff' }}>
                        Add Duty
                    </Button>
                </Box>
                <List sx={{ mt: 3 }}>
                    {duties.map((duty) => (
                        <ListItem key={duty.id}>
                            <ListItemText primary={duty.duty} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default EmployeeDuties;
