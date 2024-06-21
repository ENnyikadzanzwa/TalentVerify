import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Grid, TextField, Button, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast } from 'react-toastify';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const userResponse = await axiosInstance.get('/user/me/');
        const companyId = userResponse.data.company_id;
        const response = await axiosInstance.get(`/departments/?company=${companyId}`);
        setDepartments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching departments');
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.get('/user/me/');
      const companyId = userResponse.data.company_id;
      const response = await axiosInstance.post('/departments/', {
        department_name: newDepartment,
        company: companyId
      });
      setDepartments([...departments, response.data]);
      setNewDepartment('');
      toast.success('Department added successfully.');
    } catch (error) {
      toast.error('Error adding department.');
      console.error('Error adding department:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const rowColors = ['#008080', '#00bfff', '#f0f0f0']; // Colors associated with the logo

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Add New Department
              </Typography>
              <form onSubmit={handleAddDepartment}>
                <TextField
                  label="Department Name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: '#00bfff' }}>
                  Add Department
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Departments
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department Name</TableCell>
                      <TableCell align="right">Employee Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((department, index) => (
                      <TableRow key={department.department_id} style={{ backgroundColor: rowColors[index % rowColors.length] }}>
                        <TableCell component="th" scope="row">
                          {department.department_name}
                        </TableCell>
                        <TableCell align="right">{department.employee_count || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageDepartments;
