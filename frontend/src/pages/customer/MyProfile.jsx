import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import './style/MyProfile.css';

const MyProfile = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // State for form inputs
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        contactNo: '',
    });

    // State for password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Fetch user profile data
    useEffect(() => {
        if (isLoggedIn && user) {
            fetchProfile();
        }
    }, [isLoggedIn, user]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`);
            const userData = response.data;
            setProfile(userData);
            setFormData({
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                gender: userData.gender,
                contactNo: userData.contact_no,
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    // Handle input changes in edit mode
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode((prevMode) => !prevMode);
    };

    // Save updated profile data
    const handleSaveProfile = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`, formData);
            alert('Profile updated successfully!');
            setIsEditMode(false); // Exit edit mode after saving
            fetchProfile();
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Handle password input change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prevData) => ({ ...prevData, [name]: value }));
    }

    // Handle change password modal
    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    // Close the password modal
    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Save the new password
    const handleSavePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        // validate password
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}/change-password`, {
                currentPassword,
                newPassword,
            });

            alert('Password updated successfully!');
            closePasswordModal();
        } catch (err) {
            console.error('Error changing password:', err.response?.data || err.message);
            alert('Failed to change password. Please try again.');
        }
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="myprofile-page">
            <Sidebar userType='customer' />
            <div className="myprofile-container">
                <h1>Welcome, {profile.first_name}!</h1>
                <div className="myprofile-content">
                    <form className="myprofile-form">
                        {/* First Name */}
                        <div className="customer-form-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                readOnly={!isEditMode}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="customer-form-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                readOnly={!isEditMode}
                            />
                        </div>

                        {/* Email */}
                        <div className="customer-form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                readOnly={!isEditMode}
                            />
                        </div>

                        {/* Gender */}
                        <div className="customer-form-group">
                            <label>Gender:</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Contact Number */}
                        <div className="customer-form-group">
                            <label>Contact Number:</label>
                            <input
                                type="tel"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                readOnly={!isEditMode}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="customer-buttons">
                            {isEditMode ? (
                                <>
                                    <button type="button" onClick={handleSaveProfile}>
                                        Save Profile
                                    </button>
                                    <button type="button" onClick={toggleEditMode}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" onClick={toggleEditMode}>
                                        Edit Profile
                                    </button>
                                    <button type="button" onClick={handleChangePassword}>
                                        Change Password
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="p-modal-overlay">
                    <div className="p-modal-content">
                        <div className="p-modal-header">
                            <h2>Change Password</h2>
                            <span className="p-close-btn" onClick={closePasswordModal}>
                                &times;
                            </span>
                        </div>
                        <form className="p-password-form">
                            <div className="p-form-group">
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="p-form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="p-form-group">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="p-modal-buttons">
                                <button type="p-button" onClick={handleSavePassword}>
                                    Save
                                </button>
                                <button type="p-button" onClick={closePasswordModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;