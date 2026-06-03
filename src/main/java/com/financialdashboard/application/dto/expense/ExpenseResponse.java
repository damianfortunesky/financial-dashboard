package com.financialdashboard.application.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ExpenseResponse(
        Long id,
        LocalDate expenseDate,
        BigDecimal amount,
        Long categoryId,
        Long subcategoryId,
        Long paymentMethodId,
        Long merchantId,
        Boolean necessary,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
