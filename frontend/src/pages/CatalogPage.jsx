import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Catalog.module.css";

const CatalogPage = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [wishlist, setWishlist] = useState(new Set());
    
    // Track active filters in state (Sort + Category)
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeSort, setActiveSort] = useState("title-asc");

    const navigate = useNavigate();
     // This gets the logged-in user's information stored in the browser
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchCategories();
        loadWishlist();
        // Apply filters whenever category or sort changes
        applyFilters(activeCategory, activeSort);
    }, [activeCategory, activeSort]);

    const loadWishlist = () => {
        if (user) {
            fetch(`http://localhost:8080/api/wishlist?userId=${user.accountId}`)
            .then(res => res.json())
            .then(data => {
                const bookIds = new Set(data.map(item => item.bookId));
                setWishlist(bookIds);
            })
            .catch(err => console.error(err));
        } else {
            const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || "[]");
            setWishlist(new Set(guestWishlist));
        }
    };

    const fetchCategories = async () => {
        const res = await fetch("http://localhost:8080/api/categories");
        if (res.ok) setCategories(await res.json());
    };

    const toggleWishlist = async (bookId) => {
    const isInWishlist = wishlist.has(bookId);

    if (!user) {
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || "[]");
        if (isInWishlist) {
        const updated = guestWishlist.filter(id => id !== bookId);
        localStorage.setItem('guestWishlist', JSON.stringify(updated));
        setWishlist(new Set(updated));
        } else {
        guestWishlist.push(bookId);
        localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
        setWishlist(new Set(guestWishlist));
        }
        return;
    }

    try {
        if (isInWishlist) {
        const res = await fetch(`http://localhost:8080/api/wishlist/remove?userId=${user.accountId}&bookId=${bookId}`, {
            method: "DELETE"
        });
        if (res.ok) {
            const newWishlist = new Set(wishlist);
            newWishlist.delete(bookId);
            setWishlist(newWishlist);
        }
        } else {
        const res = await fetch(`http://localhost:8080/api/wishlist/add?userId=${user.accountId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId })
        });
        if (res.ok) {
            const newWishlist = new Set(wishlist);
            newWishlist.add(bookId);
            setWishlist(newWishlist);
        }
        }
    } catch (err) {
        console.error(err);
    }
    };

    // Applies two filters being genre and sort order
    const applyFilters = async (categoryId, sortString) => {
        // ex: price-asc -> ["price","asc"] 
        const [sortBy, dir] = sortString.split('-');
        let url = "";

        if (categoryId === "all") {
            // URL: /api/books?sortBy=price&dir=asc
            url = `http://localhost:8080/api/books?sortBy=${sortBy}&dir=${dir}`;
        } else {
            // URL: /api/books/category/1?sortBy=price&dir=asc
            url = `http://localhost:8080/api/books/category/${categoryId}?sortBy=${sortBy}&dir=${dir}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Search bar
    const handleSearch = (e) => {
        e.preventDefault();
       
        fetch(`http://localhost:8080/api/books/search?keyword=${searchQuery}`)
            .then(res => res.json())
            .then(data => setBooks(data));
        
        setActiveCategory("all");
    };

   const addToCart = async (bookId) => {
        const book = books.find(b => b.bookId === bookId);
        const qtyStr = prompt(`How many copies of "${book.title}"?`, "1");
        if (!qtyStr) return;
        const quantity = parseInt(qtyStr);
        if (isNaN(quantity) || quantity <= 0) return alert("Invalid number");
        if (quantity > book.stock) return alert(`Only ${book.stock} in stock.`);

        // Guest mode
        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            // Add cartItemId for guest to allow deletion
            const existingItem = localCart.find(i => i.bookId === bookId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
                if (existingItem.quantity > book.stock) existingItem.quantity = book.stock;
            } else {
                localCart.push({ 
                    cartItemId: Date.now(), // Fake ID for key
                    bookId: book.bookId, 
                    quantity: quantity,
                    book: { title: book.title, author: book.author, price: book.price, stock: book.stock, coverImage: book.coverImage },
                    unitPrice: book.price 
                });
            }
            localStorage.setItem('guestCart', JSON.stringify(localCart));
            alert("Added to Guest Cart! Login to checkout.");
            return;
        }

        // Logged in mode
        try {
            const res = await fetch(`http://localhost:8080/api/cart/add?userId=${user.accountId}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: bookId, quantity: quantity })
            });
            if (res.ok) alert("Added to cart!");
        } catch (err) { console.error(err); }
    };
    
    return (
        <div className="container">
            <div className={styles.header}>
                <h1 className="heading">Check Out Our Books</h1>
                <div className={styles.headerButtons}>
                    {user && <button onClick={() => navigate('/profile')} className={styles.primaryBtn}>My Profile</button>}
                    <button onClick={() => navigate('/cart')} className={styles.primaryBtn}>View Cart</button>
                </div>
            </div>

            <div className={`card ${styles.filterBar}`}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input type="text" placeholder="Search title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={styles.input} />
                    <button type="submit" className={styles.darkBtn}>Search</button>
                </form>

                <div className={styles.divider}></div>

                {/* Sort dropdown */}
                <select 
                    value={activeSort} 
                    onChange={(e) => setActiveSort(e.target.value)} 
                    className={styles.select}
                >
                    <option value="title-asc">Name (A-Z)</option>
                    <option value="title-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                </select>

                <div className={styles.divider}></div>

                {/* Category dropdown */}
                <select 
                    value={activeCategory} 
                    onChange={(e) => setActiveCategory(e.target.value)} 
                    className={styles.select}
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Book grid */}
            <div className={styles.bookGrid}>
                {books.map((book) => (
                    <div key={book.bookId} className={`card ${styles.bookCard}`}>   
                        <Link to={`/book/${book.bookId}`} className={styles.bookLink}>
                            <div className={styles.imagePlaceholder}>
                                {book.coverImage ? (
                                    <img src={`/${book.coverImage}`} alt={book.title} className={styles.bookImage} />
                                ) : <span>No Image</span>}
                            </div>
                        </Link>
                        <h3 className={styles.bookTitle}>{book.title}</h3>
                        {book.stock > 0 && book.stock <= 10 && (
                            <p className={styles.lowStock}>Almost sold out!</p>
                        )}
                        <div className={styles.titleRow}>
                        <p className={styles.bookAuthor}>by {book.author}</p>
                        <button
                                onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(book.bookId);
                                }}
                                className={styles.wishlistBtn}
                                title={wishlist.has(book.bookId) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {wishlist.has(book.bookId) ?  '❤️' : '🤍'}
                        </button>
                        </div>
                        <div className={styles.bookFooter}>
                            <span className={styles.bookPrice}>${book.price}</span>
                            <span className={book.stock > 0 ? styles.stockAvailable : styles.stockOut}>
                                {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                        <button onClick={() => addToCart(book.bookId)} disabled={book.stock === 0} className={book.stock > 0 ? styles.primaryBtn : styles.disabledBtn}>
                        {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogPage;
