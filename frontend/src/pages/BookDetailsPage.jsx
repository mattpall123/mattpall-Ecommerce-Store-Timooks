import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/BookDetails.module.css"; 

const BookDetailsPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputQty, setInputQty] = useState(1);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [hasReviewed, setHasReviewed] = useState(false);
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/books/${id}`);
            if (res.ok) {
                const data = await res.json();
                setBook(data);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/reviews/book/${id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
                
                // Check if current user already reviewed
                if (user) {
                    const userReview = data.find(review => review.userId === user.accountId);
                    setHasReviewed(Boolean(userReview));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = async () => {
        const quantity = parseInt(inputQty);
        if (isNaN(quantity) || quantity <= 0) return alert("Please enter a valid number.");
        if (quantity > book.stock) return alert(`Sorry, only ${book.stock} left.`);

        if (!user) {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || "[]");
            const existingItem = localCart.find(item => item.bookId === book.bookId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
                if (existingItem.quantity > book.stock) {existingItem.quantity = book.stock;}
            } else {
                localCart.push({ 
                    cartItemId: Date.now(), 
                    bookId: book.bookId, 
                    quantity: quantity,
                    book: book, 
                    unitPrice: book.price 
                });
            }
            localStorage.setItem('guestCart', JSON.stringify(localCart));
            alert(`Added ${quantity} to Guest Cart! Login to save.`);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/cart/add?userId=${user.accountId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book.bookId, quantity: quantity })
            });

            if (res.ok) alert(`Added ${quantity} to cart!`);
            else alert("Failed to add to cart.");
        } catch (err) {
            console.error(err);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("Please login to leave a review");
            navigate('/login');
            return;
        }

        if (!newReview.comment.trim()) {
            alert("Please write a comment");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/reviews/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.accountId,
                    bookId: id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (res.ok) {
                alert("Review submitted!");
                setNewReview({ rating: 5, comment: "" });
                fetchReviews();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to submit review");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting review");
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/reviews/${reviewId}?userId=${user.accountId}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                alert("Review deleted");
                fetchReviews();
            } else {
                alert("Failed to delete review");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!book) return <div className={styles.loading}>Book not found.</div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/catalog')} className={styles.backBtn}>
                Back to Catalog
            </button>

            <div className={styles.topSection}>
                <div className={styles.imageCol}>
                    <div className={styles.imagePlaceholder}>
                        <img src={`/${book.coverImage}`} alt={book.title} className={styles.bookImage} />
                    </div>
                </div>

                <div className={styles.infoCol}>
                    <h1 className={styles.title}>{book.title}</h1>
                    <p className={styles.author}>by <strong>{book.author}</strong></p>
                    
                    {reviews.length > 0 && (
                        <div className={styles.ratingDisplay}>
                            <span className={styles.stars}>{renderStars(Math.round(averageRating))}</span>
                            <span className={styles.ratingText}>
                                {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    )}
                    
                    <div className={styles.metaRow}>
                        <span className={styles.categoryBadge}>{book.category.name}</span>
                        <span className={styles.publisher}>Publisher: {book.publisher.name}</span>
                    </div>

                    <div className={styles.priceBlock}>
                        <span className={styles.price}>${book.price}</span>
                    </div>

                    <div className={styles.stockStatus}>
                        {book.stock > 0 ? (
                            <span className={book.stock < 10 ? styles.stockLow : styles.stockAvailable}>
                                {book.stock < 10 ? `Only ${book.stock} left` : `Available: ${book.stock} in stock`}
                            </span>
                        ) : <span className={styles.stockOut}>Out of Stock</span>}
                    </div>

                    {book.stock > 0 && (
                        <div className={styles.actionRow}>
                            <div className={styles.qtyWrapper}>
                                <label className={styles.qtyLabel}>Quantity:</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max={book.stock} 
                                    value={inputQty} 
                                    onChange={(e) => setInputQty(e.target.value)} 
                                    className={styles.qtyInput} 
                                />
                            </div>
                            <button onClick={addToCart} className={styles.addToCartBtn}>
                                Add to Cart
                            </button>
                        </div>
                    )}
                    
                    <p className={styles.popularityText}>114 units bought in the last week</p>
                </div>
            </div>

            <div className={`card ${styles.aboutSection}`}>
                <h2 className={styles.sectionTitle}>About this Book</h2>
                <p className={styles.description}>{book.description}</p>
                
                <h3 className={styles.detailsTitle}>Product Details</h3>
                <ul className={styles.detailList}>
                    <li><strong>ISBN:</strong> {book.isbn}</li>
                    <li><strong>Published:</strong> {book.publicationYear}</li>
                    <li><strong>Pages:</strong> {book.pageCount}</li>
                </ul>
            </div>

            {/* Reviews Section */}
            <div className={`card ${styles.reviewsSection}`}>
                <h2 className={styles.sectionTitle}>Customer Reviews</h2>
                
                {/* Write Review Form */}
                {user && !hasReviewed && (
                    <div className={styles.reviewForm}>
                        <h3>Write a Review</h3>
                        <form onSubmit={submitReview}>
                            <div className={styles.ratingInput}>
                                <label>Rating:</label>
                                <select 
                                    value={newReview.rating} 
                                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                    className={styles.select}
                                >
                                    <option value={5}>5 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={1}>1 Star</option>
                                </select>
                            </div>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                placeholder="Share your thoughts about this book..."
                                className={styles.reviewTextarea}
                                rows={4}
                                required
                            />
                            <button type="submit" className={styles.submitReviewBtn}>
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}

                {!user && (
                    <p className={styles.loginPrompt}>
                        <button onClick={() => navigate('/login')} className={styles.linkBtn}>
                            Login
                        </button> to write a review
                    </p>
                )}

                {hasReviewed && (
                    <p className={styles.alreadyReviewed}>
                        You've already reviewed this book. Thank you!
                    </p>
                )}

                {/* Display Reviews */}
                <div className={styles.reviewsList}>
                    {reviews.length === 0 ? (
                        <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.reviewId} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div>
                                        <span className={styles.reviewAuthor}>{review.userName}</span>
                                        <span className={styles.reviewStars}>{renderStars(review.rating)}</span>
                                    </div>
                                    <span className={styles.reviewDate}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={styles.reviewComment}>{review.comment}</p>
                                {user && review.userId === user.accountId && (
                                    <button 
                                        onClick={() => deleteReview(review.reviewId)}
                                        className={styles.deleteReviewBtn}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;