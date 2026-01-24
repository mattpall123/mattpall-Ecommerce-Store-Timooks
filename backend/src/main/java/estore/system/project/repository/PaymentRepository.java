package estore.system.project.repository;

import estore.system.project.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    // Find payment details for a specific order
    Optional<Payment> findByOrder_OrderId(Integer orderId);
}