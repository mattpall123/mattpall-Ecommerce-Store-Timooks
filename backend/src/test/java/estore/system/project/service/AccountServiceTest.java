package estore.system.project.service;

import estore.system.project.model.Account;
import estore.system.project.model.Role;
import estore.system.project.repository.AccountRepository;
import estore.system.project.repository.RoleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat; // Best practice assertions
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given; // BDD Style

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock private AccountRepository accountRepository;
    @Mock private RoleRepository roleRepository;
    @InjectMocks private AccountService accountService;

    @SuppressWarnings("null")
    @Test
    @DisplayName("Should register user successfully when email is unique")
    void shouldRegisterUser_WhenEmailIsUnique() {
        // Given
        Account newAccount = Account.builder().email("new@test.com").build();
        given(accountRepository.existsByEmail("new@test.com")).willReturn(false);
        given(roleRepository.findByName("CUSTOMER")).willReturn(Optional.of(new Role(1, "CUSTOMER")));
        given(accountRepository.save(any(Account.class))).willAnswer(i -> i.getArguments()[0]);

        // When
        Account created = accountService.registerUser(newAccount, "password123");

        // Then
        assertThat(created).isNotNull();
        assertThat(created.getRole().getName()).isEqualTo("CUSTOMER");
        assertThat(created.getPasswordHash()).isNotEmpty();
    }

    @Test
    @DisplayName("Should throw exception when registering with duplicate email")
    void shouldThrowException_WhenRegisteringDuplicateEmail() {
        // Given
        Account newAccount = Account.builder().email("existing@test.com").build();
        given(accountRepository.existsByEmail("existing@test.com")).willReturn(true);

        // When/Then
        assertThrows(RuntimeException.class, () -> accountService.registerUser(newAccount, "pass"));
    }

    @Test
    @DisplayName("Should throw exception when login password is incorrect")
    void shouldThrowException_WhenLoginPasswordIsIncorrect() {
        // Given
        String correctPass = "secret";
        Account dbAccount = Account.builder()
                .email("test@test.com")
                .passwordHash(correctPass.getBytes(StandardCharsets.UTF_8))
                .build();

        given(accountRepository.findByEmail("test@test.com")).willReturn(Optional.of(dbAccount));

        // When/Then
        assertThrows(RuntimeException.class, () -> accountService.login("test@test.com", "WRONG_PASS"));
    }
}