package estore.system.project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
// We are using big decimal for accurate calculations regarding money
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Orders") 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @CreationTimestamp
    private LocalDateTime orderDate;

    @Builder.Default
    private String status = "Pending";

    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingFee;

    @Column(insertable = false, updatable = false)
    private BigDecimal total;

    private String shipName;
    private String shipLine1;
    private String shipCity;
    private String shipPostalCode;
    private String shipCountry;
    
    private String billName;
    private String billLine1;
    private String billCity;
    private String billPostalCode;
    private String billCountry;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<OrderItem> orderItems;
}