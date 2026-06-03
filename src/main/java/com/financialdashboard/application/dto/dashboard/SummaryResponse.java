package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record SummaryResponse(BigDecimal monthlyIncome, BigDecimal monthlyExpense, BigDecimal monthlyBalance, BigDecimal savingRate, BigDecimal expenseRatio) {
}
