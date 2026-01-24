package estore.system.project.repository;

import estore.system.project.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Integer> {
    // View history for a specific book 
    List<InventoryTransaction> findByBook_BookIdOrderByCreatedAtDesc(Integer bookId);
}