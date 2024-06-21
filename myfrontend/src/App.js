import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Dashboard from './components/Dashboard/Dashboard';
import CompanyAdminDashboard from './components/Dashboard/CompanyAdminDashboard';
import ItAdminDashboard from './components/Dashboard/ItAdminDashboard';
import AuditorDashboard from './components/Dashboard/AuditorDashboard';
import HrManagerDashboard from './components/Dashboard/HrManagerDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import CompanyExecDashboard from './components/Dashboard/CompanyExecDashboard';
import CompanyProfile from './components/Companies/CompanyProfile';
import AddEmployee from './components/Employees/AddEmployee';
import ManageDepartments from './components/Departments/ManageDepartments';
import PrivateRoute from './components/Auth/PrivateRoute'; // Import PrivateRoute

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* company admin operations */}
                <Route 
                    path="/company-admin-dashboard" 
                    element={
                        <PrivateRoute>
                            <CompanyAdminDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/company-profile" 
                    element={
                        <PrivateRoute>
                            <CompanyProfile />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/add-employee" 
                    element={
                        <PrivateRoute>
                            <AddEmployee />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/manage-departments" 
                    element={
                        <PrivateRoute>
                            <ManageDepartments />
                        </PrivateRoute>
                    } 
                />
                {/* IT admin dashboard */}
                <Route 
                    path="/it-admin-dashboard" 
                    element={
                        <PrivateRoute>
                            <ItAdminDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/auditor-dashboard" 
                    element={
                        <PrivateRoute>
                            <AuditorDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/hr-manager-dashboard" 
                    element={
                        <PrivateRoute>
                            <HrManagerDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/employee-dashboard" 
                    element={
                        <PrivateRoute>
                            <EmployeeDashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/company-exec-dashboard" 
                    element={
                        <PrivateRoute>
                            <CompanyExecDashboard />
                        </PrivateRoute>
                    } 
                />
                {/* Add other routes for Departments, Employees, EmployeeDuties, Users */}
            </Routes>
            <ToastContainer />
        </Router>
    );
}

export default App;
