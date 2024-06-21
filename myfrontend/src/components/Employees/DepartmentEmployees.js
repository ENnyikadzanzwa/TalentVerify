import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Paper, Typography, Box, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@mui/material';

const DepartmentEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employee_name');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get('/department_employees/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEmployees(response.data);
                setFilteredEmployees(response.data);

                // Assuming all employees belong to the same department
                if (response.data.length > 0) {
                    setDepartmentName(response.data[0].department_name);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter((employee) =>
            employee.employee_name.toLowerCase().includes(search.toLowerCase()) ||
            employee.role.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [search, employees]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedEmployees = filteredEmployees.sort((a, b) => {
            if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
            if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredEmployees(sortedEmployees);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Department: {departmentName}
                </Typography>
                <Box mb={3}>
                    <TextField
                        label="Search Employees"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleSearchChange}
                    />
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'employee_name'}
                                        direction={orderBy === 'employee_name' ? order : 'asc'}
                                        onClick={() => handleSortRequest('employee_name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'role'}
                                        direction={orderBy === 'role' ? order : 'asc'}
                                        onClick={() => handleSortRequest('role')}
                                    >
                                        Role
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.employee_id}>
                                    <TableCell>{employee.employee_name}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default DepartmentEmployees;
