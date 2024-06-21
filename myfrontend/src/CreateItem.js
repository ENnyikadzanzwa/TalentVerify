import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

function CreateItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleAddItem = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/items/', { name, description })
      .then(response => {
        setName('');
        setDescription('');
        navigate('/items');
      })
      .catch(error => {
        console.error('Error adding item', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Create Item</Typography>
        <form onSubmit={handleAddItem}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Item
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default CreateItem;
