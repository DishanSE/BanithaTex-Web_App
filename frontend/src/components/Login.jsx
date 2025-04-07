import React, { useContext, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { AuthContext } from '../context/AuthContext.jsx';

const Login = () => {
    const { checkAuth } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
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
            alert(error.response?.data?.message || 'Login failed :(');
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button 
                            type="button"
                            className="password-toggle-icon" 
                            onClick={togglePasswordVisibility}
                            tabIndex="-1"
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <button className='login-btn' type="submit">LOGIN</button>

                    {/* Forgot Password Link */}
                    <p className='forgot-password' onClick={handleForgotPasswordClick}>
                        Forgot Password?
                    </p>

                    {/* Signup Link */}
                    <p className='signup-link'>
                        Create an Account: <span onClick={handleSignupClick}>Signup</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;