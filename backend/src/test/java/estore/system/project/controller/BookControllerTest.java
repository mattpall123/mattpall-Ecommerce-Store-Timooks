package estore.system.project.controller;

import estore.system.project.model.Book;
import estore.system.project.service.BookService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BookControllerTest {

    @Autowired private MockMvc mockMvc;
    @SuppressWarnings("removal")
    @MockBean private BookService bookService;

    @Test
    @DisplayName("GET /api/books - Should return list of books")
    void shouldReturnListOfBooks_WhenRequestsAllBooks() throws Exception {
        // Given
        Book book = Book.builder().bookId(1).title("Dune").price(BigDecimal.TEN).build();
        given(bookService.getAllBooks("title", "asc")).willReturn(List.of(book));

        // When / Then
        mockMvc.perform(get("/api/books?sortBy=title&dir=asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Dune"));
    }
    
    @Test
    @DisplayName("GET /api/books/search - Should return matching books")
    void shouldReturnMatchingBooks_WhenSearchingByKeyword() throws Exception {
        // Given
        Book book = Book.builder().bookId(1).title("Dune").build();
        given(bookService.searchBooks("Dune")).willReturn(List.of(book));

        // When / Then
        mockMvc.perform(get("/api/books/search?keyword=Dune"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Dune"));
    }
}