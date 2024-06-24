import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Container, Grid, TextField, Button, Card, CardContent, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    employee_name: '',
    employee_number: '',
    department: '',
    role: '',
    start_date: '',
    email: '',
    gender: '',
    date_of_birth: ''
  });
  const [departments, setDepartments] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [bulkEmployees, setBulkEmployees] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchUserAndDepartments = async () => {
      try {
        const userResponse = await axiosInstance.get('/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCompanyId(userResponse.data.company_id);

        const departmentsResponse = await axiosInstance.get(`/departments/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error('Error fetching user or departments:', error);
      }
    };
    fetchUserAndDepartments();
  }, []);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/add_employee/', {
        ...employee,
        company: companyId,
        department: employee.department
      });
      toast.success('Employee added successfully.');
      setEmployee({
        employee_name: '',
        employee_number: '',
        department: '',
        role: '',
        start_date: '',
        email: '',
        gender: '',
        date_of_birth: ''
      });
    } catch (error) {
      toast.error('Error adding employee.');
      console.error('Error adding employee:', error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', bulkEmployees);
    formData.append('department', selectedDepartment);

    try {
      const response = await axiosInstance.post('/bulk/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { detail, skipped_employees } = response.data;
      toast.success(`${detail}. ${skipped_employees.length} employees skipped.`);
      setBulkEmployees(null);
    } catch (error) {
      toast.error('Error adding bulk employees.');
      console.error('Error adding bulk employees:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Single Employee Entry
              </Typography>
              <form onSubmit={handleSingleSubmit}>
                <TextField
                  label="Employee Name"
                  name="employee_name"
                  value={employee.employee_name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <TextField
                  label="Employee Number"
                  name="employee_number"
                  value={employee.employee_number}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={employee.department}
                    onChange={handleChange}
                    sx={{ bgcolor: '#f0f0f0' }}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.department_id} value={department.department_id}>
                        {department.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={employee.role}
                    onChange={handleChange}
                    sx={{ bgcolor: '#f0f0f0' }}
                  >
                    <MenuItem value="company_admin">Company Administrator</MenuItem>
                    <MenuItem value="hr_manager">HR Manager/Staff</MenuItem>
                    <MenuItem value="it_admin">IT Administrator</MenuItem>
                    <MenuItem value="company_executive">Company Executive</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="auditor">Auditor/Compliance Officer</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Start Date"
                  name="start_date"
                  type="date"
                  value={employee.start_date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <TextField
                  label="Gender"
                  name="gender"
                  value={employee.gender}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <TextField
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={employee.date_of_birth}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ bgcolor: '#f0f0f0' }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: '#00bfff' }}>
                  Add Employee
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Bulk Upload Employees
              </Typography>
              <form onSubmit={handleBulkSubmit}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="selectedDepartment"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    sx={{ bgcolor: '#f0f0f0' }}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.department_id} value={department.department_id}>
                        {department.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 2, bgcolor: '#00bfff' }}
                >
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={(e) => setBulkEmployees(e.target.files[0])}
                  />
                </Button>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: '#00bfff' }}>
                  Upload
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddEmployee;
