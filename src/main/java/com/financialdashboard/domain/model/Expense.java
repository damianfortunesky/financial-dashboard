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
public class Expense {
    private Long id;
    private LocalDate expenseDate;
    private BigDecimal amount;
    private Long categoryId;
    private Long subcategoryId;
    private Long paymentMethodId;
    private Long merchantId;
    private Boolean necessary;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
