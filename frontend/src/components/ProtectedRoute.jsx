import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await apiClient.get('/auth/user');
                setRole(response.data.role);
            } catch (error) {
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <div className='btn'>Loading...</div>;
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;