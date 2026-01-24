package estore.system.project.repository;

import estore.system.project.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
}