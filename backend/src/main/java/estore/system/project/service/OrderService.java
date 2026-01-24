package estore.system.project.service;

import estore.system.project.model.*;
import estore.system.project.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


// This service handles checkout, payment, and stock reduction
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository; 
    private final BookRepository bookRepository;
    private final AccountRepository accountRepository;

    // Convert cart to order
    @Transactional
    public Order placeOrder(Integer accountId, String shipName, String shipAddress, String billAddress) {
        // Retrieve the Cart
        ShoppingCart cart = cartRepository.findByAccount_AccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout empty cart");
        }

        // Calculate Totals & Check Inventory 
        // BigDecimal class is designed for money. Calculates decimals without rounding errors
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            if (item.getBook().getStock() < item.getQuantity()) {
                throw new RuntimeException("Item " + item.getBook().getTitle() + " is out of stock!");
            }
            BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // Mock Payment 
        if (!processPayment(subtotal)) {
            throw new RuntimeException("Credit Card Authorization Failed.");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .account(account)
                .status("Confirmed")
                .subtotal(subtotal)
                .tax(subtotal.multiply(new BigDecimal("0.13"))) // 13% Tax
                .shippingFee(new BigDecimal("10.00"))
                .shipName(shipName)
                .shipLine1(shipAddress)
                .billLine1(billAddress)
                .orderItems(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Move Items from Cart to Order & reduce stock
        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();
            
            // Decrease Stock
            book.setStock(book.getStock() - cartItem.getQuantity());
            bookRepository.save(book);

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();
            
            orderItemRepository.save(orderItem);
        }

        // Clear the Shopping Cart
        cartItemRepository.deleteByShoppingCart_CartId(cart.getCartId());
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // Get order history for a user
    public List<Order> getOrderHistory(Integer accountId) {
        return orderRepository.findByAccount_AccountIdOrderByOrderDateDesc(accountId);
    }

    // Mock Payment Logic (Simulates 10% failure rate) with 90% chance of success
    private boolean processPayment(BigDecimal amount) {
        return Math.random() > 0.1;
    }
}