import React, { children } from 'react'
import { createContext, useState, useEffect } from 'react'
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/auth/user');
            setIsLoggedIn(true);
            setUserRole(response.data.role);
        } catch (error) {
            setIsLoggedIn(false);
            setUserRole(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
            setIsLoggedIn(false);
            setUserRole(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (loading) {
        return <div className='btn'>Loading...</div>
    }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, checkAuth, logout }}> {children} </AuthContext.Provider>
  );
};
