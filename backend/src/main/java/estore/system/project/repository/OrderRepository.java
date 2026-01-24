package estore.system.project.repository;

import estore.system.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Find order history for a specific user, newest first
    List<Order> findByAccount_AccountIdOrderByOrderDateDesc(Integer accountId);
}