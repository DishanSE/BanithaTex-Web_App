import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Product from './pages/Product.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageInventory from './pages/admin/ManageInventory.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import Reports from './pages/admin/Reports.jsx'
import AdminLogout from './pages/admin/ALogout.jsx'
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import CustomerProfile from './pages/customer/MyProfile.jsx';
import CustomerOrders from './pages/customer/MyOrders.jsx';
import CustomerLogout from './pages/customer/CLogout.jsx'
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import {AuthProvider} from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx';

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home/>} />
                        <Route path='/about' element={<AboutUs />} />
                        <Route path='/product' element={<Product />} />
                        <Route path='/product/:id' element={<ProductDetail />} />
                        <Route path='/contact' element={<ContactUs/>} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/checkout' element={<Checkout />}/>
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/inventory"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageInventory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/logout"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminLogout />
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
                        <Route 
                            path='/customer/profile'
                            element={
                                <ProtectedRoute allowedRoles={['customer']}>
                                    <CustomerProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route 
                            path='/customer/orders'
                            element={
                                <ProtectedRoute allowedRoles={['customer']}>
                                    <CustomerOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route 
                            path='/customer/logout'
                            element={
                                <ProtectedRoute allowedRoles={['customer']}>
                                    <CustomerLogout />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <Footer />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;