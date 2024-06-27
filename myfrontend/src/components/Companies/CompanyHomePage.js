import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosConfig';
import { Container, Grid, TextField, Button, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, SaveAlt as SaveAltIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import 'chart.js/auto';

const CompanyHomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  const [yearData, setYearData] = useState({});
  const [genderData, setGenderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);

  const departmentChartRef = useRef(null);
  const yearChartRef = useRef(null);
  const genderChartRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const userResponse = await axiosInstance.get('/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const companyId = userResponse.data.company_id;
        const employeesResponse = await axiosInstance.get(`/employees/?company=${companyId}`);
        const departmentsResponse = await axiosInstance.get(`/departments/?company=${companyId}`);
        setEmployees(employeesResponse.data);
        setFilteredEmployees(employeesResponse.data);
        setDepartments(departmentsResponse.data);
        generateChartData(employeesResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching employees');
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterAndSortEmployees(e.target.value, filterDepartment, sortField, sortOrder);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    filterAndSortEmployees(searchTerm, filterDepartment, field, order);
  };

  const handleDepartmentFilterChange = (value) => {
    setFilterDepartment(value);
    filterAndSortEmployees(searchTerm, value, sortField, sortOrder);
  };

  const filterAndSortEmployees = (search, department, field, order) => {
    let filtered = employees;

    if (search) {
      filtered = filtered.filter((employee) =>
        employee.employee_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (department) {
      filtered = filtered.filter((employee) => employee.department_id === department);
    }

    if (field) {
      filtered.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredEmployees(filtered);
  };

  const generateChartData = (data) => {
    const departmentCount = {};
    const yearCount = {};
    const genderCount = { Male: 0, Female: 0 };

    data.forEach((employee) => {
      // Count by department
      if (departmentCount[employee.department_name]) {
        departmentCount[employee.department_name]++;
      } else {
        departmentCount[employee.department_name] = 1;
      }

      // Count by year joined
      const year = new Date(employee.start_date).getFullYear();
      if (yearCount[year]) {
        yearCount[year]++;
      } else {
        yearCount[year] = 1;
      }

      // Count by gender
      if (employee.gender === 'Male') {
        genderCount.Male++;
      } else if (employee.gender === 'Female') {
        genderCount.Female++;
      }
    });

    setDepartmentData({
      labels: Object.keys(departmentCount),
      datasets: [
        {
          label: 'Employees by Department',
          data: Object.values(departmentCount),
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1
        }
      ]
    });

    setYearData({
      labels: Object.keys(yearCount),
      datasets: [
        {
          label: 'Employees by Year Joined',
          data: Object.values(yearCount),
          backgroundColor: 'rgba(153,102,255,0.4)',
          borderColor: 'rgba(153,102,255,1)',
          borderWidth: 1
        }
      ]
    });

    setGenderData({
      labels: Object.keys(genderCount),
      datasets: [
        {
          label: 'Employees by Gender',
          data: Object.values(genderCount),
          backgroundColor: ['rgba(255,99,132,0.4)', 'rgba(54,162,235,0.4)'],
          borderColor: ['rgba(255,99,132,1)', 'rgba(54,162,235,1)'],
          borderWidth: 1
        }
      ]
    });
  };

  const handleDownloadChart = (chartRef, chartName) => {
    const chart = chartRef.current;
    const chartURL = chart.toBase64Image();
    saveAs(chartURL, `${chartName}.png`);
  };

  const handleDepartmentClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDepartmentClose = () => {
    setAnchorEl(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Search Employee"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Employees
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Employee Name
                        <IconButton onClick={() => handleSort('employee_name')}>
                          {sortField === 'employee_name' && sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>Employee Number</TableCell>
                      <TableCell>
                        Department
                        <IconButton onClick={handleDepartmentClick}>
                          <FilterListIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleDepartmentClose}
                        >
                          <MenuItem value="" onClick={() => handleDepartmentFilterChange('')}>
                            All
                          </MenuItem>
                          {departments.map((dept) => (
                            <MenuItem key={dept.department_id} value={dept.department_id} onClick={() => handleDepartmentFilterChange(dept.department_id)}>
                              {dept.department_name}
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>
                        Start Date
                        <IconButton onClick={() => handleSort('start_date')}>
                          {sortField === 'start_date' && sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Date of Birth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.employee_id}>
                        <TableCell>{employee.employee_name}</TableCell>
                        <TableCell>{employee.employee_number}</TableCell>
                        <TableCell>{employee.department_name}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.start_date}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.gender}</TableCell>
                        <TableCell>{employee.date_of_birth}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Employees by Department
              </Typography>
              <Bar data={departmentData} ref={departmentChartRef} />
              <Button
                startIcon={<SaveAltIcon />}
                onClick={() => handleDownloadChart(departmentChartRef, 'Employees_by_Department')}
              >
                Download Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Employees by Year Joined
              </Typography>
              <Bar data={yearData} ref={yearChartRef} />
              <Button
                startIcon={<SaveAltIcon />}
                onClick={() => handleDownloadChart(yearChartRef, 'Employees_by_Year_Joined')}
              >
                Download Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Employees by Gender
              </Typography>
              <Pie data={genderData} ref={genderChartRef} />
              <Button
                startIcon={<SaveAltIcon />}
                onClick={() => handleDownloadChart(genderChartRef, 'Employees_by_Gender')}
              >
                Download Chart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyHomePage;
