import React, { useState } from 'react';
import apiClient from '../api/apiClient.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        contact_no: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/signup', formData);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className="signup-container">
            <div className='signup'>
                <h2 className='signup-heading'>Sign Up</h2>
                <form className='signup-form' onSubmit={handleSubmit}>
                    <div className="form-field">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <select className='gender' name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <input
                            type="text"
                            name="contact_no"
                            placeholder="Contact Number"
                            value={formData.contact_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                                    
                    <div className="form-field full-width">
                        <button className='signup-btn' type="submit">SIGN UP</button>
                    </div>
                    <p className='login-link'>Already have an account ? <span onClick={handleLoginClick} >Login</span></p>
                </form>
            </div>
        </div>
    );
};

export default Signup;