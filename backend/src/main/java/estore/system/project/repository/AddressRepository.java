package estore.system.project.repository;

import estore.system.project.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    
    List<Address> findByAccount_AccountId(Integer accountId);
}