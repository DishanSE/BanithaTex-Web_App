import React, { children } from 'react'
import { createContext, useState, useEffect } from 'react'
import apiClient from '../api/apiClient';
import Loader from '../assets/loader.gif'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // Store the full user object
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/auth/user');
            setIsLoggedIn(true);
            setUser(response.data); // Store the full user object
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
            setIsLoggedIn(false);
            setUser(null); // Clear the user object on logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

   if (loading) return <div class="loader"><img src={Loader} /></div>;

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
