package estore.system.project.repository;

import estore.system.project.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Sort;

public interface BookRepository extends JpaRepository<Book, Integer> {
    
    List<Book> findByCategory_CategoryId(Integer categoryId, Sort sort);
    List<Book> findByPublisher_PublisherId(Integer publisherId);

    // searching for title by author ignoring cases for both
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);
}