package estore.system.project.controller;

import estore.system.project.model.Book;
import estore.system.project.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller handles all public requests related to books
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    //Call the service to get the sorted list
   @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String dir) {
        return bookService.getAllBooks(sortBy, dir);
    }

    // Get a specific book's details by using its ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                // If not found return a 404 error
                .orElse(ResponseEntity.notFound().build());
    }

    // Search Books (by title or author)
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookService.searchBooks(keyword);
    }

    // Filter by Category ID (also it allows sorting)
    @GetMapping("/category/{categoryId}")
    public List<Book> getBooksByCategory( @PathVariable Integer categoryId, @RequestParam(defaultValue = "title") String sortBy, @RequestParam(defaultValue = "asc") String dir) {
        return bookService.getBooksByCategory(categoryId, sortBy, dir);
    }
    
    // Create/Update Book (Admin function)
    @PostMapping
    public Book saveBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    // Delete Book (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}