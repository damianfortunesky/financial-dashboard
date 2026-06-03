package com.financialdashboard.application.dto.merchant;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdateMerchantRequest {
    @NotBlank @Size(max = 150)
    private String name;
    @Size(max = 255)
    private String description;
    private Boolean active;
}
