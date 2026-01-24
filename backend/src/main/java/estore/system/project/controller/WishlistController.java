package estore.system.project.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import estore.system.project.model.Wishlist;
import estore.system.project.repository.WishlistRepository;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @GetMapping
    public List<Wishlist> getWishlist(@RequestParam Integer userId) { 
        return wishlistRepository.findByUserId(userId);
    }
    
    @PostMapping("/add")
    public Wishlist addToWishlist(@RequestParam Integer userId, @RequestBody Map<String, Integer> body) {
        Integer bookId = body.get("bookId");
        
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndBookId(userId, bookId);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setBookId(bookId);
        return wishlistRepository.save(wishlist);
    }
    
    @DeleteMapping("/remove")
    public void removeFromWishlist(@RequestParam Integer userId, @RequestParam Integer bookId) { 
        wishlistRepository.deleteByUserIdAndBookId(userId, bookId);
    }
}