// src/components/Companies/CompanyForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const CompanyForm = () => {
    const [company, setCompany] = useState({
        company_name: '',
        registration_date: '',
        registration_number: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        email: ''
    });

    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchCompany = async () => {
                const response = await axios.get(`/api/companies/${id}/`);
                setCompany(response.data);
            };

            fetchCompany();
        }
    }, [id]);

    const handleChange = (e) => {
        setCompany({
            ...company,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`/api/companies/${id}/`, company);
            } else {
                await axios.post('/api/companies/', company);
            }
            history.push('/companies');
        } catch (error) {
            console.error('Error saving company', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Company Name</label>
                <input type="text" name="company_name" value={company.company_name} onChange={handleChange} />
            </div>
            <div>
                <label>Registration Date</label>
                <input type="date" name="registration_date" value={company.registration_date} onChange={handleChange} />
            </div>
            <div>
                <label>Registration Number</label>
                <input type="text" name="registration_number" value={company.registration_number} onChange={handleChange} />
            </div>
            <div>
                <label>Address</label>
                <input type="text" name="address" value={company.address} onChange={handleChange} />
            </div>
            <div>
                <label>Contact Person</label>
                <input type="text" name="contact_person" value={company.contact_person} onChange={handleChange} />
            </div>
            <div>
                <label>Contact Phone</label>
                <input type="text" name="contact_phone" value={company.contact_phone} onChange={handleChange} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="email" value={company.email} onChange={handleChange} />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default CompanyForm;
