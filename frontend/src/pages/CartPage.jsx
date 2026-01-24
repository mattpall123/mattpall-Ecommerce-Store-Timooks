import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Cart.module.css"; 

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        // GUEST MODE
        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            setCart({ items: localCart });
            calculateTotal(localCart);
            return;
        }

        // USER MODE
        try {
            const res = await fetch(`http://localhost:8080/api/cart?userId=${user.accountId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
                calculateTotal(data.items);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    const calculateTotal = (items) => {
        if (!items) return;
        const sum = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        setTotal(sum);
    };

    // Update logic
    const handleUpdateQuantity = async (cartItemId, newQty) => {
        if (!newQty || newQty < 0) return false;

        // Guest update
        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            // Guests identify items by bookId if cartItemId is missing
            const item = localCart.find(i => i.cartItemId === cartItemId || i.bookId === cartItemId); 
            
            if (item) {
                item.quantity = parseInt(newQty);
                if (item.book && item.quantity > item.book.stock) {
                    alert(`Max stock is ${item.book.stock}`);
                    item.quantity = item.book.stock;
                }
                localStorage.setItem('guestCart', JSON.stringify(localCart));
                fetchCart();
                return true;
            }
            return false;
        }

        // User update
        try {
            const res = await fetch(`http://localhost:8080/api/cart/update?userId=${user.accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId: cartItemId, quantity: parseInt(newQty) })
            });

            if (res.ok) {
                fetchCart();
                return true;
            } else {
                alert("Failed to update quantity");
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // Remove logic
    const removeItem = async (itemId) => {
        if (!window.confirm("Remove this item?")) return;

        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            // Filter out the item
            const updatedCart = localCart.filter(i => i.cartItemId !== itemId && i.bookId !== itemId);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            fetchCart();
            return;
        }

        await fetch(`http://localhost:8080/api/cart/remove/${itemId}?userId=${user.accountId}`, {
            method: 'DELETE'
        });
        fetchCart();
    };

    if (!cart) return <p className={styles.loading}>Loading Cart...</p>;

    return (
        <div className={styles.cartContainer}>
            <h2>Your Shopping Cart</h2>
            
            {(!cart.items || cart.items.length === 0) ? (
                <div className={styles.emptyCart}>
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/catalog')} className={styles.linkBtn}>Go Shopping</button>
                </div>
            ) : (
                <>
                    <table className={styles.cartTable}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th className={styles.tableCell}>Book</th>
                                <th className={styles.tableCell}>Quantity</th>
                                <th className={styles.tableCell}>Price</th>
                                <th className={styles.tableCell}>Total</th>
                                <th className={styles.tableCell}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.items.map((item) => (
                                <CartItemRow 
                                    // Use bookId as fallback key for guests if cartItemId is missing
                                    key={item.cartItemId || item.bookId} 
                                    item={item} 
                                    styles={styles} 
                                    onUpdate={handleUpdateQuantity} 
                                    onRemove={removeItem} 
                                />
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.cartFooter}>
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <div>
                            <button onClick={() => navigate('/catalog')} className={styles.secondaryBtn}>Continue Shopping</button>
                            <button onClick={() => navigate('/checkout')} className={styles.checkoutBtn}>Proceed to Checkout</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

//  Handles the "Edit Mode" for each row
const CartItemRow = ({ item, styles, onUpdate, onRemove }) => {
    const [qty, setQty] = useState(item.quantity);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => { setQty(item.quantity); setIsChanged(false); }, [item.quantity]);

    const handleChange = (e) => {
        setQty(e.target.value);
        setIsChanged(parseInt(e.target.value) !== item.quantity);
    };

    const handleSave = async () => {
        const success = await onUpdate(item.cartItemId || item.bookId, qty);
        if (success) setIsChanged(false);
    };

    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableCell}>
                <strong>{item.book.title}</strong><br/>
                <span className={styles.authorText}>{item.book.author}</span>
            </td>
            <td className={styles.tableCell}>
                <div className={styles.itemTable}>
                    <input 
                        type="number" 
                        min="1" 
                        value={qty} 
                        onChange={handleChange}
                        style={{ width: '60px', padding: '5px' }}
                    />
                    {isChanged && (
                        <button onClick={handleSave} className={styles.confirmBtn}>
                            Confirm
                        </button>
                    )}
                </div>
            </td>
            <td className={styles.tableCell}>${item.unitPrice.toFixed(2)}</td>
            <td className={styles.tableCell}>${(item.unitPrice * qty).toFixed(2)}</td>
            <td className={styles.tableCell}>
                <button onClick={() => onRemove(item.cartItemId || item.bookId)} className={styles.deleteBtn}>Remove</button>
            </td>
        </tr>
    );
};

export default CartPage;