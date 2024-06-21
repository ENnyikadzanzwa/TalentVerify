// src/components/EmployeeDuties/EmployeeDutyList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const EmployeeDutyList = () => {
    const [employeeDuties, setEmployeeDuties] = useState([]);

    useEffect(() => {
        const fetchEmployeeDuties = async () => {
            const response = await axiosInstance.get('/api/employee-duties/');
            setEmployeeDuties(response.data);
        };

        fetchEmployeeDuties();
    }, []);

    return (
        <div>
            <h2>Employee Duties</h2>
            <Link to="/employee-duties/new">Add Employee Duty</Link>
            <ul>
                {employeeDuties.map(employeeDuty => (
                    <li key={employeeDuty.id}>
                        {employeeDuty.duty}
                        <Link to={`/employee-duties/${employeeDuty.id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeDutyList;
