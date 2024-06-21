// src/components/Users/UserList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axiosInstance.get('/api/users/');
            setUsers(response.data);
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Users</h2>
            <Link to="/users/new">Add User</Link>
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.username} ({user.user_role})
                        <Link to={`/users/${user.user_id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
