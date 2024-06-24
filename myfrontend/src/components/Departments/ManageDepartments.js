import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Grid, TextField, Button, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';
import FilterListIcon from '@mui/icons-material/FilterList';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const userResponse = await axiosInstance.get('/me/');
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
      const userResponse = await axiosInstance.get('/me/');
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

  const handleDepartmentClick = async (departmentId) => {
    try {
      const response = await axiosInstance.get(`/department/${departmentId}/employees/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedDepartment(departmentId);
      setDepartmentEmployees(response.data);
    } catch (error) {
      toast.error('Error fetching employees.');
      console.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeClick = async (employeeId) => {
    try {
      const response = await axiosInstance.get(`/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedEmployee(response.data);
      setOpenDialog(true);
    } catch (error) {
      toast.error('Error fetching employee details.');
      console.error('Error fetching employee details:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = departmentEmployees
    .filter(employee => employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(employee => (filterRole ? employee.role === filterRole : true));

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
                      <TableRow
                        key={department.department_id}
                        style={{ backgroundColor: rowColors[index % rowColors.length] }}
                        onClick={() => handleDepartmentClick(department.department_id)}
                      >
                        <TableCell component="th" scope="row">
                          {department.department_name}
                        </TableCell>
                        <TableCell align="right">{department.employee_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {selectedDepartment && (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Employees in Selected Department
                </Typography>
                <TextField
                  label="Search by name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Filter by Role</InputLabel>
                  <Select
                    value={filterRole}
                    onChange={handleRoleFilterChange}
                    startAdornment={<FilterListIcon />}
                  >
                    <MenuItem value=""><em>All Roles</em></MenuItem>
                    <MenuItem value="company_admin">Company Administrator</MenuItem>
                    <MenuItem value="hr_manager">HR Manager/Staff</MenuItem>
                    <MenuItem value="it_admin">IT Administrator</MenuItem>
                    <MenuItem value="company_executive">Company Executive</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="auditor">Auditor/Compliance Officer</MenuItem>
                  </Select>
                </FormControl>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.employee_id} onClick={() => handleEmployeeClick(employee.employee_id)}>
                          <TableCell component="th" scope="row">
                            {employee.employee_name}
                          </TableCell>
                          <TableCell>{employee.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {selectedEmployee && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6">Name: {selectedEmployee.employee_name}</Typography>
              <Typography variant="body1">Employee Number: {selectedEmployee.employee_number}</Typography>
              <Typography variant="body1">Role: {selectedEmployee.role}</Typography>
              <Typography variant="body1">Email: {selectedEmployee.email}</Typography>
              <Typography variant="body1">Gender: {selectedEmployee.gender}</Typography>
              <Typography variant="body1">Date of Birth: {selectedEmployee.date_of_birth}</Typography>
              <Typography variant="body1">Duties:</Typography>
              {selectedEmployee.duties && selectedEmployee.duties.map((duty) => (
                <Typography key={duty.id} variant="body2">{duty.duty}</Typography>
              ))}
              <Typography variant="body1">Experiences:</Typography>
              {selectedEmployee.experiences && selectedEmployee.experiences.map((experience) => (
                <Typography key={experience.id} variant="body2">{experience.company_name} - {experience.position}</Typography>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ManageDepartments;
