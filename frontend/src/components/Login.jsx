import React, { useContext, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import {AuthContext} from '../context/AuthContext.jsx'

const Login = () => {
    const { checkAuth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', formData);
            const { user } = response.data;
            const role = user.role;

            alert('Login successful');

            await checkAuth();

            // Navigate based on the user's role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Login failed:(');
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    }

    return (
        <div className="login-container">
            <div className='login'>
                <h2 className='login-heading'>Login</h2>
                <form className='login-form' onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button className='login-btn' type="submit">LOGIN</button>
                    <p className='signup-link'>Crate an Account: <span onClick={handleSignupClick}>Signup</span></p>
                </form>
            </div>
        </div>
    );
};

export default Login;