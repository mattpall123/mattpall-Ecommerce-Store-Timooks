package estore.system.project.repository;

import estore.system.project.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    
    void deleteByShoppingCart_CartId(Integer cartId);
}