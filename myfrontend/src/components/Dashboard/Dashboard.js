// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                <li><Link to="/companies">Companies</Link></li>
                <li><Link to="/departments">Departments</Link></li>
                <li><Link to="/employees">Employees</Link></li>
                <li><Link to="/employee-duties">Employee Duties</Link></li>
                <li><Link to="/users">Users</Link></li>
            </ul>
        </div>
    );
};

export default Dashboard;
