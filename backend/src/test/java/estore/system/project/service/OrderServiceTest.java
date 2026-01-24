package estore.system.project.service;

import estore.system.project.model.*;
import estore.system.project.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private ShoppingCartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private AccountRepository accountRepository;
    @Mock private BookRepository bookRepository; 
    
    @InjectMocks private OrderService orderService;

    @SuppressWarnings("null")
    @Test
    @DisplayName("Should calculate order total and reduce stock successfully")
    void shouldCalculateTotalAndReduceStock_WhenOrderPlaced() {
        // Given
        Account user = Account.builder().accountId(1).build();
        Book book = Book.builder().bookId(1).price(new BigDecimal("10.00")).stock(10).build();
        
        ShoppingCart cart = ShoppingCart.builder().cartId(1).account(user).build();
        CartItem item = CartItem.builder().book(book).quantity(2).unitPrice(book.getPrice()).shoppingCart(cart).build();
        cart.setItems(new ArrayList<>(List.of(item)));

        given(cartRepository.findByAccount_AccountId(1)).willReturn(Optional.of(cart));
        given(accountRepository.findById(1)).willReturn(Optional.of(user));
        given(orderRepository.save(any(Order.class))).willAnswer(i -> i.getArguments()[0]);
        // Given book repo will save any book, return that book
        given(bookRepository.save(any(Book.class))).willAnswer(i -> i.getArguments()[0]);

        // When
        Order order = orderService.placeOrder(1, "John", "Addr", "BillAddr");

        // Then
        assertThat(order).isNotNull();
        // 2 books * $10.00 = $20.00
        assertThat(order.getSubtotal()).isEqualByComparingTo(new BigDecimal("20.00"));
        assertThat(book.getStock()).isEqualTo(8); // Stock 10 - 2
        
        // Verify cart was cleared
        verify(cartItemRepository).deleteByShoppingCart_CartId(1);
    }
}