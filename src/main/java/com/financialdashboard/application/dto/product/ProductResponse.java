package com.financialdashboard.application.dto.product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ProductResponse(
        Long id,
        String name,
        String description,
        String unitOfMeasure,
        Long categoryId,
        Long subcategoryId,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
