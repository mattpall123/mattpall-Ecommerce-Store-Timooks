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
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private ShoppingCartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private BookRepository bookRepository;
    @Mock private AccountRepository accountRepository;
    @InjectMocks private CartService cartService;

    @Test
    @DisplayName("Should throw exception when adding item with insufficient stock")
    void shouldThrowException_WhenInsufficientStock() {
        // Given
        Book book = Book.builder().bookId(1).stock(5).build();
        ShoppingCart cart = ShoppingCart.builder().items(new ArrayList<>()).build();

        given(cartRepository.findByAccount_AccountId(1)).willReturn(Optional.of(cart));
        given(bookRepository.findById(1)).willReturn(Optional.of(book));

        // When/Then
        assertThrows(RuntimeException.class, () -> cartService.addToCart(1, 1, 10));
    }

    @SuppressWarnings("null")
    @Test
    @DisplayName("Should add new item to cart successfully")
    void shouldAddNewItemToCart_WhenStockIsAvailable() {
        // Given
        Book book = Book.builder().bookId(1).stock(10).price(BigDecimal.TEN).build();
        ShoppingCart cart = ShoppingCart.builder().cartId(1).items(new ArrayList<>()).build();

        given(cartRepository.findByAccount_AccountId(1)).willReturn(Optional.of(cart));
        given(bookRepository.findById(1)).willReturn(Optional.of(book));
        given(cartRepository.save(any(ShoppingCart.class))).willAnswer(i -> i.getArguments()[0]);

        // When
        ShoppingCart updatedCart = cartService.addToCart(1, 1, 1);

        // Then
        assertThat(updatedCart.getItems()).hasSize(1);
        assertThat(updatedCart.getItems().get(0).getQuantity()).isEqualTo(1);
    }
}