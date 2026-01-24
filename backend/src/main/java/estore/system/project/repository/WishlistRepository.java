package estore.system.project.repository;

import estore.system.project.model.Wishlist;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import java.util.*;


public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    List<Wishlist> findByUserId(Integer userId); 
    
    Optional<Wishlist> findByUserIdAndBookId(Integer userId, Integer bookId); 

    @Transactional
    @Modifying 
    void deleteByUserIdAndBookId(Integer userId, Integer bookId); 
}