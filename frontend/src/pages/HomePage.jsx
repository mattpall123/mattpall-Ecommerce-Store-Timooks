import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

const HomePage = () => {
    const navigate = useNavigate();
    // Check if user is logged in to show different buttons
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className={styles.container}>
            {/* Hero / Welcome Section */}
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>Welcome to Timooks</h1>
                <p className={styles.heroText}>
                    Your one-stop shop for books, knowledge, and more.
                </p>
            </header>

            {/* Navigation Grid */}
            <div className={styles.grid}>
                
                {/* Catalog */}
                <div className={styles.card} onClick={() => navigate('/catalog')}>
                    <h3 className={styles.cardTitle}>Browse Catalog</h3>
                    <p>Explore our collection and add items to your cart.</p>
                </div>

                {/* Shopping Cart */}
                <div className={styles.card} onClick={() => navigate('/cart')}>
                    <h3 className={styles.cardTitle}> Shopping Cart</h3>
                    <p>View your items and proceed to checkout.</p>
                </div>

                {/* Conditional User Buttons */}
                {user ? (
                    <>
                        {/* If Logged In: Show Profile */}
                        <div className={styles.card} onClick={() => navigate('/profile')}>
                            <h3 className={styles.cardTitle}>My Profile</h3>
                            <p>Welcome back, {user.firstName}. View your order history.</p>
                        </div>

                        {/* If Admin: Show Dashboard */}
                        {user.role?.name === 'ADMIN' && (
                            <div className={styles.cardAdmin} onClick={() => navigate('/admin')}>
                                <h3 className={styles.cardTitle}>Admin Dashboard</h3>
                                <p>Manage inventory and view sales reports.</p>
                            </div>
                        )}
                    </>
                ) : (
                    /* If NOT Logged In: Show Login/Register */
                    <div className={styles.card} onClick={() => navigate('/login')}>
                        <h3 className={styles.cardTitle}> Login / Register</h3>
                        <p>Sign in to track your orders and speed up checkout.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;