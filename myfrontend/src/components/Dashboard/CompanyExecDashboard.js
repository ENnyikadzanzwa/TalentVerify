// src/components/Dashboard/CompanyExecDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const CompanyExecDashboard = () => {
    return (
        <div>
            <h2>Company Executive Dashboard</h2>
            <ul>
                <li><Link to="/view-reports">View Reports</Link></li>
                <li><Link to="/analyze-data">Analyze Employee Data</Link></li>
            </ul>
        </div>
    );
};

export default CompanyExecDashboard;
