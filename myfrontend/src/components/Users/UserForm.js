// src/components/Users/UserForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const UserForm = () => {
    const [user, setUser] = useState({
        username: '',
        password_hash: '',
        user_role: '',
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

        const fetchUser = async () => {
            if (id) {
                const response = await axiosInstance.get(`/api/users/${id}/`);
                setUser(response.data);
            }
        };

        fetchCompanies();
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosInstance.put(`/api/users/${id}/`, user);
            } else {
                await axiosInstance.post('/api/users/', user);
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password_hash" value={user.password_hash} onChange={handleChange} />
            </div>
            <div>
                <label>Role</label>
                <select name="user_role" value={user.user_role} onChange={handleChange}>
                    <option value="">Select Role</option>
                    <option value="company_admin">Company Admin</option>
                    <option value="talent_verify_admin">Talent Verify Admin</option>
                    <option value="system_admin">System Admin</option>
                </select>
            </div>
            <div>
                <label>Company</label>
                <select name="company_id" value={user.company_id} onChange={handleChange}>
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

export default UserForm;
