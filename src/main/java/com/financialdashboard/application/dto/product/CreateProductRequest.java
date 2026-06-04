package com.financialdashboard.application.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateProductRequest {
    @NotBlank @Size(max = 150)
    private String name;
    @Size(max = 100)
    private String description;
    @NotBlank @Size(max = 50)
    private String unitOfMeasure;
    @NotNull
    private Long categoryId;
    private Long subcategoryId;
}
