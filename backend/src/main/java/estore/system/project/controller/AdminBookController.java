package estore.system.project.controller;

import estore.system.project.model.Book;
import estore.system.project.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// This controller allows the admin to manage the book inventory
@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookService bookService;

    // Add a new Book to the database
    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.saveBook(book));
    }

    // Update existing Book, if book don't exist 404 error 
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Integer id, @RequestBody Book bookDetails) {

        return bookService.getBookById(id)
                .map(existingBook -> {
                    existingBook.setTitle(bookDetails.getTitle());
                    existingBook.setAuthor(bookDetails.getAuthor());
                    existingBook.setPrice(bookDetails.getPrice());
                    existingBook.setStock(bookDetails.getStock());
                    return ResponseEntity.ok(bookService.saveBook(existingBook));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}