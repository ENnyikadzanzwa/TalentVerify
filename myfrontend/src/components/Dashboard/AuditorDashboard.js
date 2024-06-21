// src/components/Dashboard/AuditorDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const AuditorDashboard = () => {
    return (
        <div>
            <h2>Auditor Dashboard</h2>
            <ul>
                <li><Link to="/access-info">Access Company and Employee Information</Link></li>
                <li><Link to="/generate-reports">Generate Compliance Reports</Link></li>
            </ul>
        </div>
    );
};

export default AuditorDashboard;
