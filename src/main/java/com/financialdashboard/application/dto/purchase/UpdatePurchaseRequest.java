package com.financialdashboard.application.dto.purchase;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdatePurchaseRequest {
    @NotNull
    private LocalDate purchaseDate;
    @NotNull
    private Long merchantId;
    @NotNull
    private Long paymentMethodId;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal totalAmount;
    @Size(max = 255)
    private String notes;
}
