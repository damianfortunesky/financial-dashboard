package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record TopProductResponse(String product, BigDecimal quantity, BigDecimal amount) {
}
