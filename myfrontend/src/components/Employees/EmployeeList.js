import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Box, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get('/employees/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Employees
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search Employees"
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>{employee.employee_name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department.department_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeList;
