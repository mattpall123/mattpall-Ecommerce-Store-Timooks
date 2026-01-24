package estore.system.project.service;

import estore.system.project.controller.CartController;
import estore.system.project.model.*;
import estore.system.project.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

// This service manages the shopping cart logic
// Add, Remove, Create
@Service
@RequiredArgsConstructor
public class CartService {

    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final AccountRepository accountRepository;

    // Get or Create a Cart for a User
    public ShoppingCart getOrCreateCart(Integer accountId) {

        if (cartRepository.findByAccount_AccountId(accountId).isPresent()) {
            return cartRepository.findByAccount_AccountId(accountId).get();
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ShoppingCart newCart = ShoppingCart.builder()
                .account(account)
                .items(new ArrayList<>())
                .build();
        
        return cartRepository.save(newCart);
    }

    // Add an item to the cart
    @Transactional 
    public ShoppingCart addToCart(Integer accountId, Integer bookId, Integer quantity) {
        ShoppingCart cart = getOrCreateCart(accountId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock. Only " + book.getStock() + " available.");
        }

        // Check if item already exists in cart
        CartItem existingItem = null;
        for (CartItem item : cart.getItems()) {
            if (item.getBook().getBookId().equals(bookId)) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) {
            // Update existing item quantity
            int newQty = existingItem.getQuantity() + quantity;
            
            // Double check stock for total quantity
            if (book.getStock() < newQty) {
                throw new RuntimeException("Cannot add more. Total in cart would exceed stock.");
            }
            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem newItem = CartItem.builder()
                    .shoppingCart(cart)
                    .book(book)
                    .quantity(quantity)
                    .unitPrice(book.getPrice())
                    .build();
            
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return cartRepository.save(cart);
    }

    // Remove item from cart
    @Transactional
    public ShoppingCart removeFromCart(Integer accountId, Integer cartItemId) {
        ShoppingCart cart = getOrCreateCart(accountId);
        
        //  Find the item in the list 
        CartItem itemToRemove = null;
        for (CartItem item : cart.getItems()) {
            if (item.getCartItemId().equals(cartItemId)) {
                itemToRemove = item;
                break;
            }
        }

        // Remove it if found
        if (itemToRemove != null) {
            cart.getItems().remove(itemToRemove);       // Remove from memory list
            cartItemRepository.deleteById(cartItemId);  // Remove from database
        }
        
        return cartRepository.save(cart);
    }

    // Clear the cart after checkout
    @Transactional
    public void clearCart(Integer accountId) {
        ShoppingCart cart = getOrCreateCart(accountId);
        cartItemRepository.deleteByShoppingCart_CartId(cart.getCartId());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // Merges guest and account cart when guest logs in
    @Transactional
    public void mergeLocalCart(Integer accountId, java.util.List<CartController.AddToCartRequest> localItems) {
        ShoppingCart cart = getOrCreateCart(accountId);

        for (CartController.AddToCartRequest request : localItems) {
            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            // Check if item exists in DB cart
            java.util.Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getBook().getBookId().equals(book.getBookId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                // Merge quantities
                int newQty = item.getQuantity() + request.getQuantity();
                if (newQty > book.getStock()) newQty = book.getStock(); // Cap at max stock
                item.setQuantity(newQty);
                cartItemRepository.save(item);
            } else {
                // Add new item
                if (request.getQuantity() <= book.getStock()) {
                    CartItem newItem = CartItem.builder()
                            .shoppingCart(cart)
                            .book(book)
                            .quantity(request.getQuantity())
                            .unitPrice(book.getPrice())
                            .build();
                    cart.getItems().add(newItem);
                    cartItemRepository.save(newItem);
                }
            }
        }
        cartRepository.save(cart);
    }

    @Transactional
    public ShoppingCart updateItemQuantity(Integer accountId, Integer cartItemId, Integer newQuantity) {
        ShoppingCart cart = getOrCreateCart(accountId);
        
        if (newQuantity <= 0) {
            return removeFromCart(accountId, cartItemId);
        }

        CartItem targetItem = null;
        for (CartItem item : cart.getItems()) {
            if (item.getCartItemId().equals(cartItemId)) {
                targetItem = item;
                break;
            }
        }

        if (targetItem == null) throw new RuntimeException("Item not found");

        if (targetItem.getBook().getStock() < newQuantity) {
            throw new RuntimeException("Insufficient stock. Only " + targetItem.getBook().getStock() + " available.");
        }

        targetItem.setQuantity(newQuantity);
        cartItemRepository.save(targetItem);
        
        return cartRepository.save(cart);
    }
}