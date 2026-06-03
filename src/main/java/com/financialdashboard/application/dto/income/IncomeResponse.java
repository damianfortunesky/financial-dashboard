package com.financialdashboard.application.dto.income;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record IncomeResponse(
        Long id,
        LocalDate incomeDate,
        BigDecimal amount,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
