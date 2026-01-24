import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';       
import LoginPage from './pages/LoginPage';     
import RegisterPage from './pages/RegisterPage'; 
import CartPage from './pages/CartPage';       
import CatalogPage from './pages/CatalogPage'; 
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboardPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <BrowserRouter>
    
      <div className="layout-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Navbar />
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />   
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/book/:id" element={<BookDetailsPage />} />

                {/* 404 Route */}
                <Route path="*" element={<h1 style={{textAlign:'center'}}>404: Page Not Found</h1>} />
            </Routes>
        </div>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;