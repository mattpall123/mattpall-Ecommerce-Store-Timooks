import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from "../styles/Register.module.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // State for form fields
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/accounts/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 2 seconds
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.error || 'Registration failed');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Server connection failed. Is the backend running?');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <h2 className={styles.title}>Create Account</h2>
            
            {success ? (
                <div className={styles.successMessage}>
                    Registration Successful! Redirecting to login...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required
                            value={formData.email} 
                            onChange={handleChange} 
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            required
                            value={formData.password} 
                            onChange={handleChange} 
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.nameRow}>
                        <div className={styles.nameGroup}>
                            <label>First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                required
                                value={formData.firstName} 
                                onChange={handleChange} 
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.nameGroup}>
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                required
                                value={formData.lastName} 
                                onChange={handleChange} 
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </form>
            )}

            <p className={styles.footerText}>
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    );
};

export default RegisterPage;