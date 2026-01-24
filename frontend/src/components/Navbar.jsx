import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');

        window.location.href = '/login'; 
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                {/* Brand / Logo */}
                <Link to="/" className={styles.brand}>
                    Timooks
                </Link>

                {/* Navigation Links */}
                <div className={styles.links}>
                    <Link to="/catalog" className={styles.link}>Catalog</Link>
                    <Link to="/cart" className={styles.link}>Cart</Link>
                    <Link to="/wishlist" className={styles.link}>Wishlist</Link>
                    {/* Admin Only Link */}
                    {user?.role?.name === 'ADMIN' && (
                        <Link to="/admin" className={styles.adminLink}>Admin Dashboard</Link>
                    )}
                </div>

                {/* User Controls */}
                <div className={styles.auth}>
                    {user ? (
                        <>
                            <span className={styles.welcome}>Hi, {user.firstName}</span>
                            <Link to="/profile" className={styles.link}>Profile</Link>
                            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.link}>Login</Link>
                            <Link to="/register" className={styles.registerBtn}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;