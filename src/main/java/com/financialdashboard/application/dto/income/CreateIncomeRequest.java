package com.financialdashboard.application.dto.income;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class CreateIncomeRequest {
    @NotNull
    private LocalDate incomeDate;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal amount;
    @Size(max = 255)
    private String description;
}
