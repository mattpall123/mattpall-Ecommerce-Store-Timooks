import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminDashboard.module.css"; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Data
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]); 
    const [view, setView] = useState('sales'); 

    // States
    const [filterEmail, setFilterEmail] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);

    // Forms
    const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', phone: '', creditCard: '' });

    useEffect(() => {
        if (!user || user.role.name !== 'ADMIN') { alert("Access Denied"); navigate('/login'); } 
        else { fetchData(); }
    }, []);
    // Fetches data
    const fetchData = async () => {
        const [ord, bk, usr,] = await Promise.all([
            fetch('http://localhost:8080/api/admin/orders').then(r => r.json()),
            fetch('http://localhost:8080/api/books').then(r => r.json()),
            fetch('http://localhost:8080/api/accounts').then(r => r.json()),
            fetch('http://localhost:8080/api/categories').then(r => r.json()),
            fetch('http://localhost:8080/api/publishers').then(r => r.json())
        ]);
        setOrders(ord); setBooks(bk); setUsers(usr);
    };

    const calculateTotalRevenue = () => 
    orders.reduce((acc, order) => {
        const orderTotal = (order.subtotal || 0) + (order.tax || 0) + (order.shippingFee || 0);
        return acc + orderTotal;
    }, 0);

    const toggleOrderDetails = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);
    const filteredOrders = orders.filter(o => o.account.email.toLowerCase().includes(filterEmail.toLowerCase()));
    
    const viewUserHistory = (email) => {
        setFilterEmail(email);
        setView('sales');
    };


    const restockBook = async (book) => {
        const amount = prompt(`Add stock for "${book.title}"?`, "10");
        if (amount) updateBookAPI({ ...book, stock: book.stock + parseInt(amount) });
    };

    const reduceStock = async (book) => {
        const amount = prompt(`Remove stock for "${book.title}"?`, "1");
        if (amount) {
            if(book.stock < amount) return alert("Not enough stock");
            updateBookAPI({ ...book, stock: book.stock - parseInt(amount) });
        }
    };

    const updateBookAPI = async (book) => {
        await fetch(`http://localhost:8080/api/admin/books/${book.bookId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(book)
        });
        fetchData();
    };

    const handleDeleteBook = async (id) => {
        if(confirm("Delete book completely?")) {
            await fetch(`http://localhost:8080/api/books/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };

    const startEdit = (u) => {
        setEditingUserId(u.accountId);
        setEditFormData({ firstName: u.firstName, lastName: u.lastName, phone: u.phone, creditCard: u.creditCard || '' });
    };

    const saveUser = async (userId) => {
        await fetch(`http://localhost:8080/api/accounts/${userId}`, {
            method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(editFormData)
        });
        setEditingUserId(null); fetchData();
    };

    return (
        <div className="container">
            <h1 className="heading">Admin Dashboard </h1>
            <p className={styles.welcomeText}>Welcome back, {user?.firstName}</p>

           
            <div className={styles.navButtons}>
                <button onClick={() => setView('sales')} className={view === 'sales' ? styles.activeTabBtn : styles.tabBtn}>Sales History</button>
                <button onClick={() => setView('inventory')} className={view === 'inventory' ? styles.activeTabBtn : styles.tabBtn}>Inventory Management</button>
                <button onClick={() => setView('users')} className={view === 'users' ? styles.activeTabBtn : styles.tabBtn}>Manage Users</button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <h3>Total Revenue</h3>
                    <p className={styles.statNum}>${calculateTotalRevenue().toFixed(2)}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Orders</h3>
                    <p className={styles.statNum}>{orders.length}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <p className={styles.statNum}>{users.length}</p>
                </div>
            </div>

            {/* Sales History */}
            {view === 'sales' && (
                <div className="card">
                    <div className={styles.cardHeader}>
                        <h2>Sales Log</h2>
                       
                        <input 
                            placeholder="Filter by Email..." 
                            value={filterEmail} 
                            onChange={e => setFilterEmail(e.target.value)} 
                            className={styles.searchInput} 
                        />
                    </div>
                    <table className={styles.table}>
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Action</th></tr></thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <>
                                    <tr key={order.orderId}>
                                        <td>#{order.orderId}</td>
                                        <td>{order.account?.email}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>${(order.subtotal + order.tax + order.shippingFee).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => toggleOrderDetails(order.orderId)} className={styles.actionBtn}>
                                                {expandedOrderId === order.orderId ? "Hide" : "View Items"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order.orderId && (
                                        <tr>
                                            <td colSpan="5" className={styles.orderDetails}>
                                                <strong>Order Details:</strong>
                                                <ul>{order.orderItems.map(item => (
                                                    <li key={item.orderItemId}>{item.quantity}x <strong>{item.book.title}</strong> (${item.unitPrice})</li>
                                                ))}
                                                    <li style={{ marginTop: '8px' }}>
                                                        Shipping: <strong>${order.shippingFee}</strong>
                                                    </li>
                                                    <li>
                                                        Tax: <strong>${order.tax}</strong>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Inventory */}
            {view === 'inventory' && (
                <div>

                    <div className="card">
                        <table className={styles.table}>
                            <thead><tr><th>ID</th><th>Title</th><th>Stock</th><th>Action</th></tr></thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book.bookId}>
                                        <td>{book.bookId}</td>
                                        <td>{book.title}</td>
                                        <td className={book.stock < 10 ? styles.stockLow : styles.stockNormal}>{book.stock}</td>
                                        <td className={styles.actionCell}>
                                            
                                            <button onClick={() => restockBook(book)} className={styles.stockBtn} title="Add Stock">+</button>
                                            <button onClick={() => reduceStock(book)} className={styles.stockBtn} title="Reduce Stock">-</button>
                                           
                                            <button onClick={() => handleDeleteBook(book.bookId)} className={styles.deleteBtn}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Users */}
            {view === 'users' && (
                <div className="card">
                    <table className={styles.table}>
                        <thead><tr><th>Name</th><th>Email</th><th>Card</th><th>Action</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.accountId}>
                                    {editingUserId === u.accountId ? (
                                        <>
                                            <td style={{display:'flex'}}>
                                                <input value={editFormData.firstName} onChange={e=>setEditFormData({...editFormData, firstName:e.target.value})} className={styles.miniInput} />
                                                <input value={editFormData.lastName} onChange={e=>setEditFormData({...editFormData, lastName:e.target.value})} className={styles.miniInput} />
                                            </td>
                                            <td>{u.email}</td>
                                            <td><input value={editFormData.creditCard} onChange={e=>setEditFormData({...editFormData, creditCard:e.target.value})} className={styles.miniInput} /></td>
                                            <td>
                                                <button onClick={() => saveUser(u.accountId)} className={styles.saveBtn}>Save</button>
                                                <button onClick={() => setEditingUserId(null)} className={styles.cancelBtn}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{u.firstName} {u.lastName}</td>
                                            <td>{u.email}</td>
                                            <td>{u.creditCard || "N/A"}</td>
                                            <td className={styles.actionCell}>
                                                <button onClick={() => startEdit(u)} className={styles.actionBtn}>Edit</button>
                                                <button onClick={() => viewUserHistory(u.email)} className={styles.actionBtn}>History</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;