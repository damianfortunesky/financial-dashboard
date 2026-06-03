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
public class Product {
    private Long id;
    private String name;
    private String description;
    private String unitOfMeasure;
    private Long categoryId;
    private Long subcategoryId;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
