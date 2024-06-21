// src/components/Departments/DepartmentForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const DepartmentForm = () => {
    const [department, setDepartment] = useState({
        department_name: '',
        company_id: ''
    });
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCompanies = async () => {
            const response = await axiosInstance.get('/api/companies/');
            setCompanies(response.data);
        };

        const fetchDepartment = async () => {
            if (id) {
                const response = await axiosInstance.get(`/api/departments/${id}/`);
                setDepartment(response.data);
            }
        };

        fetchCompanies();
        fetchDepartment();
    }, [id]);

    const handleChange = (e) => {
        setDepartment({
            ...department,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosInstance.put(`/api/departments/${id}/`, department);
            } else {
                await axiosInstance.post('/api/departments/', department);
            }
            navigate('/departments');
        } catch (error) {
            console.error('Error saving department', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Department Name</label>
                <input type="text" name="department_name" value={department.department_name} onChange={handleChange} />
            </div>
            <div>
                <label>Company</label>
                <select name="company_id" value={department.company_id} onChange={handleChange}>
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

export default DepartmentForm;
