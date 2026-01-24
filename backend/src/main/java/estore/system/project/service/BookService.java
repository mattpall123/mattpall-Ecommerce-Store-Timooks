package estore.system.project.service;

import estore.system.project.model.Book;
import estore.system.project.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;

// This service handles the book catalog logic
@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // Get all books with dynamic sorting, the Ternary function below is to check case and either sort by asc or des
    public List<Book> getAllBooks(String sortBy, String direction) {
    Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : 
                Sort.by(sortBy).ascending();

    return bookRepository.findAll(sort);
    }

    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    // Filter books by category AND apply sorting
    public List<Book> getBooksByCategory(Integer categoryId, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : 
                    Sort.by(sortBy).ascending();
        
        return bookRepository.findByCategory_CategoryId(categoryId, sort);
    }

    // Search books by title or author
    public List<Book> searchBooks(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword);
    }

    // Admin function to add/update books
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    // Admin function to delete books
    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }
}