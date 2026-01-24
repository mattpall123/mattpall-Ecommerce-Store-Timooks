package estore.system.project.repository;

import estore.system.project.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {
    // Find the active cart for a user
    Optional<ShoppingCart> findByAccount_AccountId(Integer accountId);
}