package estore.system.project.repository;

import estore.system.project.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PublisherRepository extends JpaRepository<Publisher, Integer> {
    
    Optional<Publisher> findByName(String name);
}