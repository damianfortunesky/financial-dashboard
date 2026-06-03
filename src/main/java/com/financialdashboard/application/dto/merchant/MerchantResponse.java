package com.financialdashboard.application.dto.merchant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record MerchantResponse(
        Long id,
        String name,
        String description,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
