package com.financialdashboard.application.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProductRequest {
    @NotBlank @Size(max = 150)
    private String name;
    @Size(max = 100)
    private String description;
    @NotBlank @Size(max = 50)
    private String unitOfMeasure;
    @NotNull
    private Long categoryId;
    @NotNull
    private Long subcategoryId;
    private Boolean active;
}
