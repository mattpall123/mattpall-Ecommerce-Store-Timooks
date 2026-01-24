package estore.system.project.controller;

import estore.system.project.model.Review;
import estore.system.project.repository.ReviewRepository;
import estore.system.project.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private AccountRepository accountRepository; // Changed from UserRepository
    
    // Get all reviews for a book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> getBookReviews(@PathVariable Integer bookId) {
        List<Review> reviews = reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
        
        // Add user names to reviews
        reviews.forEach(review -> {
            accountRepository.findById(Math.toIntExact(review.getUserId())).ifPresent(account -> 
                review.setUserName(account.getFirstName() + " " + account.getLastName().charAt(0) + ".")
            );
        });
        
        return ResponseEntity.ok(reviews);
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> body) {
        try {
            Integer userId = Integer.parseInt(body.get("userId").toString());
            Integer bookId = Integer.parseInt(body.get("bookId").toString());
            Integer rating = Integer.parseInt(body.get("rating").toString());
            String comment = body.get("comment").toString();
            

            if (rating < 1 || rating > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
            }
            
            if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "You already reviewed this book"));
            }
            
            Review review = Review.builder()
                .userId(userId)
                .bookId(bookId)
                .rating(rating)
                .comment(comment)
                .build();
            
            Review saved = reviewRepository.save(review);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, @RequestParam Long userId) {
        Optional<Review> review = reviewRepository.findById(reviewId);
        
        if (review.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!review.get().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "You can only delete your own reviews"));
        }
        
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }
}
