// src/components/Companies/CompanyList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            const response = await axios.get('/api/companies/');
            setCompanies(response.data);
        };

        fetchCompanies();
    }, []);

    return (
        <div>
            <h2>Companies</h2>
            <Link to="/companies/new">Add Company</Link>
            <ul>
                {companies.map(company => (
                    <li key={company.company_id}>
                        {company.company_name}
                        <Link to={`/companies/${company.company_id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompanyList;
