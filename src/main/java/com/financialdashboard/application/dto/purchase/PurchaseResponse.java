package com.financialdashboard.application.dto.purchase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record PurchaseResponse(
        Long id,
        LocalDate purchaseDate,
        Long merchantId,
        Long paymentMethodId,
        BigDecimal totalAmount,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
