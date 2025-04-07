import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, 
                { token, password }
            );
            setMessage(response.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturnToLogin = () => {
        navigate('/login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="reset-password-page">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
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
                </label>
                <label>
                    Confirm Password:
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-enter new password"
                        />
                        <button 
                            type="button"
                            className="password-toggle-icon" 
                            onClick={toggleConfirmPasswordVisibility}
                            tabIndex="-1"
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </label>
                <button className='reset-password-btn' type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Reset Password'}
                </button>
                <div className="return-to-login" onClick={handleReturnToLogin}>
                    Return to Login
                </div>
            </form>
            {message && <p className="success-message-reset">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ResetPassword;