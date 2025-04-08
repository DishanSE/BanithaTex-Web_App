import React, { useContext, useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { checkAuth } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
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
            setErrors({
                general: error.response?.data?.message || 'Login failed. Please check your credentials.'
            });
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
                
                {errors.general && (
                    <div className="error-message">{errors.general}</div>
                )}
                
                <form className='login-form' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error-input' : ''}
                        />
                        {errors.email && <div className="error-text">{errors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error-input' : ''}
                            />
                            <button 
                                type="button"
                                className="password-toggle-icon" 
                                onClick={togglePasswordVisibility}
                                tabIndex="-1"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        {errors.password && <div className="error-text">{errors.password}</div>}
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