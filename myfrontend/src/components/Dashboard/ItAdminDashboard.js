// src/components/Dashboard/ItAdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ItAdminDashboard = () => {
    return (
        <div>
            <h2>IT Admin Dashboard</h2>
            <ul>
                <li><Link to="/manage-encryption">Manage Data Encryption</Link></li>
                <li><Link to="/manage-roles">Manage User Roles</Link></li>
                <li><Link to="/security-tests">Perform Security Tests</Link></li>
            </ul>
        </div>
    );
};

export default ItAdminDashboard;
