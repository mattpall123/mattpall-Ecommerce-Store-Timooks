package estore.system.project.repository;

import estore.system.project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookIdOrderByCreatedAtDesc(Integer bookId);
    List<Review> findByUserId(Integer userId);
    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);
}
