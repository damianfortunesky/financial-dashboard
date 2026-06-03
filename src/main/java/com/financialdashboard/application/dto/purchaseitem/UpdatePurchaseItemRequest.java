package com.financialdashboard.application.dto.purchaseitem;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdatePurchaseItemRequest {
    @NotNull
    private Long productId;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal quantity;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal unitPrice;
    @Size(max = 255)
    private String notes;
}
