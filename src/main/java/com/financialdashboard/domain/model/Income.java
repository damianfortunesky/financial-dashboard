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
public class Income {
    private Long id;
    private LocalDate incomeDate;
    private BigDecimal amount;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
