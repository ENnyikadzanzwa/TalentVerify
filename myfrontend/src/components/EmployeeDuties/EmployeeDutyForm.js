// src/components/EmployeeDuties/EmployeeDutyForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const EmployeeDutyForm = () => {
    const [employeeDuty, setEmployeeDuty] = useState({
        duty: '',
        start_date: '',
        end_date: '',
        employee_id: '',
        company_id: ''
    });
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axiosInstance.get('/api/employees/');
            setEmployees(response.data);
        };

        const fetchCompanies = async () => {
            const response = await axiosInstance.get('/api/companies/');
            setCompanies(response.data);
        };

        const fetchEmployeeDuty = async () => {
            if (id) {
                const response = await axiosInstance.get(`/api/employee-duties/${id}/`);
                setEmployeeDuty(response.data);
            }
        };

        fetchEmployees();
        fetchCompanies();
        fetchEmployeeDuty();
    }, [id]);

    const handleChange = (e) => {
        setEmployeeDuty({
            ...employeeDuty,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosInstance.put(`/api/employee-duties/${id}/`, employeeDuty);
            } else {
                await axiosInstance.post('/api/employee-duties/', employeeDuty);
            }
            navigate('/employee-duties');
        } catch (error) {
            console.error('Error saving employee duty', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Duty</label>
                <input type="text" name="duty" value={employeeDuty.duty} onChange={handleChange} />
            </div>
            <div>
                <label>Start Date</label>
                <input type="date" name="start_date" value={employeeDuty.start_date} onChange={handleChange} />
            </div>
            <div>
                <label>End Date</label>
                <input type="date" name="end_date" value={employeeDuty.end_date} onChange={handleChange} />
            </div>
            <div>
                <label>Employee</label>
                <select name="employee_id" value={employeeDuty.employee_id} onChange={handleChange}>
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                        <option key={employee.employee_id} value={employee.employee_id}>{employee.employee_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Company</label>
                <select name="company_id" value={employeeDuty.company_id} onChange={handleChange}>
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

export default EmployeeDutyForm;
