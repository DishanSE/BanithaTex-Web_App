import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css'

const Sidebar = ({ userType }) => {
    const location = useLocation();

    // Define sidebar links based on user type
    const customerLinks = [
        { label: 'My Profile', path: '/customer/profile' },
        { label: 'My Orders', path: '/customer/orders' },
        { label: 'Log Out', path: '/customer/logout' },
    ];

    const adminLinks = [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Manage Inventory', path: '/admin/inventory' },
        { label: 'Manage Orders', path: '/admin/orders' },
        { label: 'Manage Users', path: '/admin/users' },
        { label: 'Reports', path: '/admin/reports' },
        { label: 'Log Out', path: '/admin/logout' },
    ];

    const links = userType === 'admin' ? adminLinks : customerLinks;

    return (
        <div className="sidebar">
            <h2>{userType === 'admin' ? 'Banitha Tex' : 'My Account'}</h2>
            <ul>
                {links.map((link) => (
                    <li key={link.path} className={location.pathname === link.path ? 'active' : ''}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;