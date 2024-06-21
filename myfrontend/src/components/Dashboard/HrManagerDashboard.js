// src/components/Dashboard/HrManagerDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const HrManagerDashboard = () => {
    return (
        <div>
            <h2>HR Manager Dashboard</h2>
            <ul>
                <li><Link to="/employees">Manage Employee Records</Link></li>
                <li><Link to="/bulk-upload">Bulk Upload Employee Data</Link></li>
            </ul>
        </div>
    );
};

export default HrManagerDashboard;
