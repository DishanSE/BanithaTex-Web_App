import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Product from './pages/Product.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Cart from './pages/Cart.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import {AuthProvider} from './context/AuthContext.jsx'

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home/>} />
                    <Route path='/about' element={<AboutUs />} />
                    <Route path='/product' element={<Product />} />
                    <Route path='/contact' element={<ContactUs/>} />
                    <Route path='/cart' element={<Cart />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                        path='/customer/dashboard'
                        element={
                            <ProtectedRoute allowedRoles={['customer']}>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;