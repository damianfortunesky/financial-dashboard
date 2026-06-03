package com.financialdashboard.application.dto.category;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record CategoryResponse(
        Long id,
        String name,
        String description,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
