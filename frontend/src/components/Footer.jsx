import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} E-Store Retail Company. All rights reserved.</p>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                Designed for EECS 4413 Project
            </p>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e7e7e7',
        textAlign: 'center',
        padding: '2rem',
        marginTop: 'auto', 
        width: '100%'
    }
};

export default Footer;