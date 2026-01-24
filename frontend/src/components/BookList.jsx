import { useEffect, useState } from "react";
import { fetchAllBooks } from "../api/books";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchAllBooks();
            setBooks(data);
            setLoading(false);
        };
        loadBooks();
    }, []);

    if (loading) return <p>Loading books...</p>;

    return (
        <div>
            <h2>Book Catalog</h2>
            {books.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookId}>
                                <td>{book.bookId}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>{book.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookList;