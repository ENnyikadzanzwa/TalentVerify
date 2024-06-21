import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/items/')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error getting items', error);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Items</Typography>
        <List>
          {items.map(item => (
            <ListItem key={item.id}>
              <ListItemText primary={`${item.name}: ${item.description}`} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" component={Link} to="/create">
          Create Item
        </Button>
      </Box>
    </Container>
  );
}

export default ItemList;
