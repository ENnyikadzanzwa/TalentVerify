// src/components/Departments/DepartmentList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await axiosInstance.get('/api/departments/');
            setDepartments(response.data);
        };

        fetchDepartments();
    }, []);

    return (
        <div>
            <h2>Departments</h2>
            <Link to="/departments/new">Add Department</Link>
            <ul>
                {departments.map(department => (
                    <li key={department.department_id}>
                        {department.department_name}
                        <Link to={`/departments/${department.department_id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DepartmentList;
