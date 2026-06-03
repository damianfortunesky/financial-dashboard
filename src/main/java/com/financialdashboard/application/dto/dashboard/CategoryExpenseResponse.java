package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record CategoryExpenseResponse(String category, BigDecimal amount, BigDecimal percentage) {
}
