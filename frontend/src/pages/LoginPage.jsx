import { useState } from 'react';
import {  Link } from 'react-router-dom';
import styles from "../styles/Login.module.css";

const LoginPage = () => {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/accounts/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                
                // Merge Guest Cart
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
                if (guestCart.length > 0) {
                    await fetch(`http://localhost:8080/api/cart/merge?userId=${data.accountId}`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(guestCart.map(i => ({ bookId: i.bookId, quantity: i.quantity })))
                    });
                    localStorage.removeItem('guestCart');
                }

                window.location.href = '/catalog';
            } else { setError(data.error || 'Invalid Credentials'); }
        // eslint-disable-next-line no-unused-vars
        } catch (err) { setError('Server Error'); }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.submitBtn}>
                    Sign In
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default LoginPage;