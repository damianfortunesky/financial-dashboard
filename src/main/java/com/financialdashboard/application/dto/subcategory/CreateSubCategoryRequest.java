package com.financialdashboard.application.dto.subcategory;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class CreateSubCategoryRequest {
    @NotNull
    private Long categoryId;
    @NotBlank @Size(max = 100)
    private String name;
    @Size(max = 255)
    private String description;
}
