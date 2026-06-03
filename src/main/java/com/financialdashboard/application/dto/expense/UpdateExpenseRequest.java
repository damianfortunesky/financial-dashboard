package com.financialdashboard.application.dto.expense;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdateExpenseRequest {
    @NotNull
    private LocalDate expenseDate;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal amount;
    @NotNull
    private Long categoryId;
    private Long subcategoryId;
    @NotNull
    private Long paymentMethodId;
    private Long merchantId;
    @NotNull
    private Boolean necessary;
    @Size(max = 255)
    private String description;
}
