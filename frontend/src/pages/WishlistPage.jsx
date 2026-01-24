import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Wishlist.module.css";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState({ items: [] });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        // guest
        if (!user) {
            const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || "[]");
            
            if (guestWishlist.length === 0) {
                setWishlist({ items: [] });
                return;
            }

            try {
                const bookPromises = guestWishlist.map(bookId =>
                    fetch(`http://localhost:8080/api/books/${bookId}`).then(res => res.json())
                );
                const books = await Promise.all(bookPromises);
                
                const items = books.map(book => ({
                    wishlistId: book.bookId,
                    bookId: book.bookId,
                    book: book
                }));
                
                setWishlist({ items });
            } catch (error) {
                console.error("Error loading guest wishlist:", error);
                setWishlist({ items: [] });
            }
            return;
        }

        // user
        try {
            const res = await fetch(`http://localhost:8080/api/wishlist?userId=${user.accountId}`);
            if (res.ok) {
                const data = await res.json();
                setWishlist({ items: data });
            }
        } catch (error) {
            console.error("Error loading wishlist:", error);
        }
    };

    const removeItem = async (wishlistId, bookId) => {
        if (!window.confirm("Remove this item from your wishlist?")) return;

        // guest
        if (!user) {
            const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || "[]");
            const updatedWishlist = guestWishlist.filter(id => id !== bookId);
            localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
            fetchWishlist();
            return;
        }

        // user
        try {
            const res = await fetch(
                `http://localhost:8080/api/wishlist/remove?userId=${user.accountId}&bookId=${bookId}`,
                { method: 'DELETE' }
            );
            if (res.ok) {
                fetchWishlist();
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const addToCart = async (book) => {
        const qtyStr = prompt(`How many copies of "${book.title}"?`, "1");
        if (!qtyStr) return;
        
        const quantity = parseInt(qtyStr);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Invalid number");
            return;
        }
        if (quantity > book.stock) {
            alert(`Only ${book.stock} in stock.`);
            return;
        }

        // guest
        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            const existingItem = localCart.find(i => i.bookId === book.bookId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
                if (existingItem.quantity > book.stock) {
                    existingItem.quantity = book.stock;
                }
            } else {
                localCart.push({
                    cartItemId: Date.now(),
                    bookId: book.bookId,
                    quantity: quantity,
                    book: {
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        stock: book.stock,
                        coverImage: book.coverImage
                    },
                    unitPrice: book.price
                });
            }
            localStorage.setItem('guestCart', JSON.stringify(localCart));
            alert("Added to Guest Cart! Login to checkout.");
            return;
        }

        // user
        try {
            const res = await fetch(`http://localhost:8080/api/cart/add?userId=${user.accountId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book.bookId, quantity: quantity })
            });
            if (res.ok) {
                alert("Added to cart!");
            } else {
                alert("Failed to add to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (!wishlist) return <p className={styles.loading}>Loading Wishlist...</p>;

    return (
        <div className={styles.wishlistContainer}>
            <h2>Your Wishlist</h2>
            
            {!user && (
                <div className={styles.guestNotice}>
                    You're browsing as a guest, your wishlist won't be saved, unless you login. <Link to="/login">Login</Link> to save your wishlist permanently.
                </div>
            )}

            {(!wishlist.items || wishlist.items.length === 0) ? (
                <div className={styles.emptyWishlist}>
                    <p>Your wishlist is empty.</p>
                    <button onClick={() => navigate('/catalog')} className={styles.linkBtn}>
                        Browse Books
                    </button>
                </div>
            ) : (
                <table className={styles.wishlistTable}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>Book</th>
                            <th className={styles.tableCell}>Author</th>
                            <th className={styles.tableCell}>Price</th>
                            <th className={styles.tableCell}>Stock</th>
                            <th className={styles.tableCell}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlist.items.map((item) => (
                            <WishlistItemRow
                                key={item.wishlistId || item.bookId}
                                item={item}
                                styles={styles}
                                onAddToCart={addToCart}
                                onRemove={removeItem}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const WishlistItemRow = ({ item, styles, onAddToCart, onRemove }) => {
    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableCell}>
                <div className={styles.bookInfo}>
                    {item.book.coverImage && (
                        <img 
                            src={`/${item.book.coverImage}`} 
                            alt={item.book.title}
                            className={styles.bookImage}
                        />
                    )}
                    <div>
                        <Link to={`/book/${item.book.bookId}`} className={styles.bookTitle}>
                            <strong>{item.book.title}</strong>
                        </Link>
                    </div>
                </div>
            </td>
            <td className={styles.tableCell}>
                <span className={styles.authorText}>{item.book.author}</span>
            </td>
            <td className={styles.tableCell}>
                <span className={styles.priceText}>${item.book.price.toFixed(2)}</span>
            </td>
            <td className={styles.tableCell}>
                <span className={item.book.stock > 0 ? styles.inStock : styles.outOfStock}>
                    {item.book.stock > 0 ? `${item.book.stock} in stock` : 'Out of Stock'}
                </span>
            </td>
            <td className={styles.tableCell}>
                <div className={styles.actionButtons}>
                    <button
                        onClick={() => onAddToCart(item.book)}
                        disabled={item.book.stock === 0}
                        className={item.book.stock > 0 ? styles.addBtn : styles.disabledBtn}
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={() => onRemove(item.wishlistId, item.book.bookId)}
                        className={styles.deleteBtn}
                    >
                        Remove
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default WishlistPage;