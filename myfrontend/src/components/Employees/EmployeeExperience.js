import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, TextField, Button, Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const EmployeeExperience = () => {
    const [experience, setExperience] = useState({
        company: '',
        role: '',
        start_date: '',
        end_date: ''
    });
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axiosInstance.get('/experiences/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        };
        fetchExperiences();
    }, []);

    const handleChange = (e) => {
        setExperience({ ...experience, [e.target.name]: e.target.value });
    };

    const handleAddExperience = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/experiences/', experience, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setExperiences([...experiences, response.data]);
            setExperience({
                company: '',
                role: '',
                start_date: '',
                end_date: ''
            });
        } catch (error) {
            console.error('Error adding experience:', error);
        }
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Experience
                </Typography>
                <Box component="form" onSubmit={handleAddExperience}>
                    <TextField
                        label="Company"
                        name="company"
                        value={experience.company}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <TextField
                        label="Role"
                        name="role"
                        value={experience.role}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={experience.start_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={experience.end_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                        sx={{ bgcolor: '#f0f0f0' }}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, bgcolor: '#00bfff' }}>
                        Add Experience
                    </Button>
                </Box>
                <List sx={{ mt: 3 }}>
                    {experiences.map((exp) => (
                        <ListItem key={exp.id}>
                            <ListItemText
                                primary={`${exp.company} - ${exp.role}`}
                                secondary={`${exp.start_date} to ${exp.end_date}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default EmployeeExperience;
