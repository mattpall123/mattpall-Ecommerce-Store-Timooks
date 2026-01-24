import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Checkout.module.css"; 

const CheckoutPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        shipName: user ? `${user.firstName} ${user.lastName}` : '',
        shipAddress: '',
        billAddress: '',
        creditCard: user ? user.creditCard || '' : '' 
    });
    const [orderSummary, setOrderSummary] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Guest Handling
    useEffect(() => {
       
    }, [user]);

    if (!user) {
        return (
            <div className={styles.checkoutContainer} style={{textAlign:'center'}}>
                <div className={styles.card}>
                    <h2 className={styles.heading}>Checkout Required</h2>
                    <p className={styles.loginSubtitle}>Please sign in to complete your purchase.</p>
                    <div className={styles.loginBoxes}>
                        <button onClick={() => navigate('/login')} className={styles.returnBtn}>Log In</button>
                        <button onClick={() => navigate('/register')} className={styles.returnBtn} style={{backgroundColor:'#6c757d'}}>Register</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsProcessing(true); setError('');
        
        // We don't process the card number in this dummy checkout
        
        try {
            const res = await fetch(`http://localhost:8080/api/orders/checkout?userId=${user.accountId}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) setOrderSummary(data);
            else setError(data.error || "Payment Failed.");
        // eslint-disable-next-line no-unused-vars
        } catch (err) { setError("Network Error"); } 
        finally { setIsProcessing(false); }
    };

    if (orderSummary) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.card}>
                    <h2 className={styles.successTitle}>Order Confirmed!</h2>
                    <p>Thank you, {user.firstName}.</p>
                    <div className={styles.orderSummaryBox}>
                        <p><strong>Order ID:</strong> #{orderSummary.orderId}</p>
                        <p><strong>Total Paid:</strong> ${(orderSummary.subtotal + orderSummary.tax + orderSummary.shippingFee).toFixed(2)}</p>
                        <p><strong>Shipping To:</strong> {orderSummary.shipLine1}</p>
                    </div>
                    <button onClick={() => navigate('/catalog')} className={styles.returnBtn}>Return to Store</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.checkoutContainer}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Checkout</h2>
                
                {error && <div className={styles.errorBox}>{error}</div>}
                
                <form onSubmit={handleCheckout} className={styles.checkoutForm}>
                    <div>
                        <label className={styles.label}>Shipping Name</label>
                        <input 
                            name="shipName" 
                            value={formData.shipName} 
                            onChange={e => setFormData({...formData, shipName: e.target.value})} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Shipping Address</label>
                        <input 
                            name="shipAddress" 
                            value={formData.shipAddress} 
                            onChange={e => setFormData({...formData, shipAddress: e.target.value})} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Billing Address</label>
                        <input 
                            name="billAddress" 
                            value={formData.billAddress} 
                            onChange={e => setFormData({...formData, billAddress: e.target.value})} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                    
                   
                    <div>
                        <label className={styles.label}>Credit Card (Last 4 Digits)</label>
                        <input 
                            type="text" 
                            name="creditCard"
                            value={formData.creditCard} 
                            onChange={e => setFormData({...formData, creditCard: e.target.value})} 
                            className={styles.input} 
                            placeholder="e.g. 1234"
                            maxLength="4"
                        />
                        <small className={styles.payment}>* Payment is simulated (10% failure rate)</small>
                    </div>

                    <button type="submit" disabled={isProcessing} className={styles.submitBtn}>
                        {isProcessing ? "Processing..." : "Confirm Payment"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;