package com.financialdashboard.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    private Long id;
    private LocalDate purchaseDate;
    private Long merchantId;
    private Long paymentMethodId;
    private BigDecimal totalAmount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
