package estore.system.project.controller;

import estore.system.project.model.Order;
import estore.system.project.service.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// This controller handles the checkout process and order history
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

  
    // Takes the cart and places/constructs orders and calls the service to process payment and reduce stock
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestParam Integer userId, @RequestBody CheckoutRequest request) {
        try {
            Order order = orderService.placeOrder(
                    userId, 
                    request.getShipName(), 
                    request.getShipAddress(), 
                    request.getBillAddress()
            );
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Returns a list of past orders for the profile page
    @GetMapping
    public List<Order> getOrderHistory(@RequestParam Integer userId) {
        return orderService.getOrderHistory(userId);
    }

    @Data
    static class CheckoutRequest {
        private String shipName;
        private String shipAddress;
        private String billAddress;
    }
}