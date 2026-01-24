import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css"; 

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [orders, setOrders] = useState([]);
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        phone: '',
        creditCard: '' 
    });

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        
        // Initialize form with existing data
        setFormData({ 
            firstName: user.firstName, 
            lastName: user.lastName, 
            phone: user.phone || '',
            creditCard: user.creditCard || '' // Load existing card
        });

        fetch(`http://localhost:8080/api/orders?userId=${user.accountId}`)
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    const handleUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/accounts/${user.accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updated = await res.json();
                // Merge old user data (like role/token) with new profile info
                const merged = { ...user, ...updated };
                localStorage.setItem('user', JSON.stringify(merged));
                setUser(merged); 
                setIsEditing(false);
                alert("Profile Updated Successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.header}>
                <h1 className={styles.cardTitle}>My Profile</h1>
                <button 
                    onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} 
                    className={styles.logoutBtn}
                >
                    Sign Out
                </button>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Personal Information</h3>
                    <button 
                        onClick={() => isEditing ? handleUpdate() : setIsEditing(true)} 
                        className={styles.editBtn}
                    >
                        {isEditing ? "Save Changes" : "Edit Info"}
                    </button>
                </div>

                {isEditing ? (
                    <div className={styles.editForm}>
                        <label>First Name</label>
                        <input 
                            value={formData.firstName} 
                            onChange={e => setFormData({...formData, firstName: e.target.value})} 
                            className={styles.input} 
                        />
                        
                        <label>Last Name</label>
                        <input 
                            value={formData.lastName} 
                            onChange={e => setFormData({...formData, lastName: e.target.value})} 
                            className={styles.input} 
                        />
                        
                        <label>Phone</label>
                        <input 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})} 
                            className={styles.input} 
                        />

                      
                        <label>Credit Card (Last 4 Digits)</label>
                        <input 
                            value={formData.creditCard} 
                            onChange={e => setFormData({...formData, creditCard: e.target.value})} 
                            className={styles.input} 
                            maxLength="4"
                            placeholder="e.g. 1234"
                        />

                        <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                        <p><strong>Card on File:</strong> **** **** **** {user.creditCard || "None"}</p>
                    </div>
                )}
            </div>

            <h3 className={styles.purchaseTitle}>Purchase History</h3>
            {orders.length === 0 ? <p>No orders found.</p> : (
                <div className={styles.ordersList}>
                    {orders.map(order => (
                        <div key={order.orderId} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <strong>Order #{order.orderId}</strong><br/>
                                    <span className={styles.orderDate}>
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.orderHeaderRight}>
                                    <span className={styles.statusBadge}>{order.status}</span><br/>
                                    <strong>${(order.subtotal + order.tax + order.shippingFee).toFixed(2)}</strong>
                                </div>
                            </div>
                            
                            <div className={styles.orderItems}>
                                {order.orderItems.map(item => (
                                    <div key={item.orderItemId} className={styles.orderItem}>
                                        <span>{item.quantity}x {item.book.title}</span>
                                        <span>${item.unitPrice}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;