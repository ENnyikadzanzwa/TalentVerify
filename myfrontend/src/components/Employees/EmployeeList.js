// src/components/Employees/EmployeeList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axiosInstance.get('/api/employees/');
            setEmployees(response.data);
        };

        fetchEmployees();
    }, []);

    return (
        <div>
            <h2>Employees</h2>
            <Link to="/employees/new">Add Employee</Link>
            <ul>
                {employees.map(employee => (
                    <li key={employee.employee_id}>
                        {employee.employee_name}
                        <Link to={`/employees/${employee.employee_id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
