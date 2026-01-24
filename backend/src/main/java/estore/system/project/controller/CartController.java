package estore.system.project.controller;

import estore.system.project.model.ShoppingCart;
import estore.system.project.service.CartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(@RequestParam Integer userId) {
        try {
            return ResponseEntity.ok(cartService.getOrCreateCart(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Integer userId, @RequestBody AddToCartRequest request) {
        try {
            ShoppingCart updatedCart = cartService.addToCart(userId, request.getBookId(), request.getQuantity());
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(@RequestParam Integer userId, @RequestBody UpdateCartRequest request) {
        try {
            ShoppingCart updatedCart = cartService.updateItemQuantity(userId, request.getCartItemId(), request.getQuantity());
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Integer cartItemId, @RequestParam Integer userId) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, cartItemId));
    }

    // For merging guest and user carts when guest logs in
    @PostMapping("/merge")
    public ResponseEntity<?> mergeCart(@RequestParam Integer userId, @RequestBody List<AddToCartRequest> localItems) {
        try {
            cartService.mergeLocalCart(userId, localItems);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Data
    public
    static class AddToCartRequest {
        private Integer bookId;
        private Integer quantity;
    }

  
    @Data
    static class UpdateCartRequest {
        private Integer cartItemId;
        private Integer quantity;
    }
}