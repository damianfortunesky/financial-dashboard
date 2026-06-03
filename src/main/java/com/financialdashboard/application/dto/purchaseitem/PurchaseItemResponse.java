package com.financialdashboard.application.dto.purchaseitem;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record PurchaseItemResponse(
        Long id,
        Long purchaseId,
        Long productId,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
