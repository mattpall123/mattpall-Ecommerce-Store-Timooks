package estore.system.project.service;

import estore.system.project.model.Account;
import estore.system.project.model.Role;
import estore.system.project.repository.AccountRepository;
import estore.system.project.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

// This service handles all the business logic for user accounts with regards to login, register update
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;

    public Account registerUser(Account account, String rawPassword) {
       
        if (accountRepository.existsByEmail(account.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Assign default role (CUSTOMER) if not set
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                account.setRole(customerRole);

        // Handle Password by just converting to bytes
        account.setPasswordHash(rawPassword.getBytes(StandardCharsets.UTF_8));
        return accountRepository.save(account);
    }

    public Account login(String email, String rawPassword) {
       
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password by comparing stored bytes and inputted bytes
        byte[] inputHash = rawPassword.getBytes(StandardCharsets.UTF_8);
        if (!Arrays.equals(account.getPasswordHash(), inputHash)) {
            throw new RuntimeException("Invalid password");
        }

        return account;
    }

    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    public Account updateAccount(Integer id, Account updatedInfo) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        account.setFirstName(updatedInfo.getFirstName());
        account.setLastName(updatedInfo.getLastName());
        account.setPhone(updatedInfo.getPhone());
        
     
        if (updatedInfo.getCreditCard() != null) {
            account.setCreditCard(updatedInfo.getCreditCard());
        }
        
        return accountRepository.save(account);
    }

    // Get All Accounts (For Admin View)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    
}