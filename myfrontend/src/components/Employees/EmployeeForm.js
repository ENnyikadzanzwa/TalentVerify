// src/components/Employees/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const EmployeeForm = () => {
    const [employee, setEmployee] = useState({
        employee_name: '',
        employee_number: '',
        role: '',
        start_date: '',
        end_date: '',
        department_id: '',
        company_id: ''
    });
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await axiosInstance.get('/api/departments/');
            setDepartments(response.data);
        };

        const fetchCompanies = async () => {
            const response = await axiosInstance.get('/api/companies/');
            setCompanies(response.data);
        };

        const fetchEmployee = async () => {
            if (id) {
                const response = await axiosInstance.get(`/api/employees/${id}/`);
                setEmployee(response.data);
            }
        };

        fetchDepartments();
        fetchCompanies();
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosInstance.put(`/api/employees/${id}/`, employee);
            } else {
                await axiosInstance.post('/api/employees/', employee);
            }
            navigate('/employees');
        } catch (error) {
            console.error('Error saving employee', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Employee Name</label>
                <input type="text" name="employee_name" value={employee.employee_name} onChange={handleChange} />
            </div>
            <div>
                <label>Employee Number</label>
                <input type="text" name="employee_number" value={employee.employee_number} onChange={handleChange} />
            </div>
            <div>
                <label>Role</label>
                <input type="text" name="role" value={employee.role} onChange={handleChange} />
            </div>
            <div>
                <label>Start Date</label>
                <input type="date" name="start_date" value={employee.start_date} onChange={handleChange} />
            </div>
            <div>
                <label>End Date</label>
                <input type="date" name="end_date" value={employee.end_date} onChange={handleChange} />
            </div>
            <div>
                <label>Department</label>
                <select name="department_id" value={employee.department_id} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map(department => (
                        <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Company</label>
                <select name="company_id" value={employee.company_id} onChange={handleChange}>
                    <option value="">Select Company</option>
                    {companies.map(company => (
                        <option key={company.company_id} value={company.company_id}>{company.company_name}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default EmployeeForm;
