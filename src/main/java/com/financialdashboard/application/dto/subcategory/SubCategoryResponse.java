package com.financialdashboard.application.dto.subcategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record SubCategoryResponse(
        Long id,
        Long categoryId,
        String name,
        String description,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
